#!/bin/python3

import os
import sys
import shutil
import logging

from datetime import datetime
from typing import Callable, Optional
from copy import deepcopy
from functools import partial
from dataclasses import dataclass

from jinja2 import Environment, FileSystemLoader, select_autoescape, Template
from yaml import load, Loader

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logging.basicConfig(
    stream=sys.stdout,
    level=logging.DEBUG,
    # format='{%(filename)s:%(lineno)d} %(levelname)s - %(message)s',
    format='%(filename)s :: %(levelname)s :: %(message)s',
)

def get_files(dir: str, prefix="", suffix=""):
    """Lists files in dir.

    Arguments:
        dir -- dir to be listed.

    Keyword Arguments:
        prefix -- filters for prefixed files (default: {""})
        suffix -- filters for suffixed files (default: {""})

    Returns:
        All files in dir which respect the prefix and suffix.
    """
    files = [ f for f in os.listdir(dir) 
        if os.path.isfile(os.path.join(dir, f))
            and f.startswith(prefix)
            and f.endswith(suffix)
    ]
    return files
    
get_yamls = partial(get_files, suffix=".yaml")
get_jinjas = partial(get_files, suffix=".jinja")


@dataclass
class Locale:
    """ A dataclass for sanitization of locales.

    Raises:
        ValueError: If the selected language is not an available language.
    """
    selected: str
    available: list[str]

    def __post_init__(self):
        if self.selected not in self.available:
            raise ValueError( "Language for localization must be amongst " +\
                "languages to check."
            )


class Localizer:
    def __init__(self,
            locale: Locale, 
            globals: dict):
        """Localizes a web page by loading some data
        and exposing a method to bake templates.

        Arguments:
            locale -- to speficy how localizations should be made.
            globals -- data which should be passed with every bake call.
        """
        self.locale = locale
        self.localized_globals = self._localize(globals)
    
    def _localize(self, vars: dict) -> dict:
        """Takes a dictionary and iterates over all objects.
        If an object provides all available locales, then
        the object is replaced with the selected locale.

        Nested localization is undefined behavior.

        Arguments:
            vars -- will be deeply copied.

        Returns:
            A copy of vars with localized objects, where possible.
        """
        root = deepcopy(vars)
        buffer: list[dict] = [root]

        # feeds the buffer
        while len(buffer) > 0:
            vars = buffer.pop(0)
            for k, v in vars.items():
                if isinstance(v, list):
                    if all(isinstance(item, str) for item in v):
                        continue
                    buffer.extend(v)
                elif isinstance(v, dict):
                    if set(self.locale.available) <= set(v.keys()):
                        vars[k] = v[self.locale.selected]
                    else:
                        buffer.append(v)

        return root

    def bake(self, template: Template, data: dict, **kwargs) -> str:
        """Subsumes a template and data to generate a page.

        Arguments:
            template -- a jinja template
            data -- a suitable dict

        Returns:
            Raw html generated by the jinja renderer.
        """
        localized_data = self._localize(data)
        
        html_content = template.render(
            **kwargs,
            **localized_data,
            **self.localized_globals
        )

        return html_content


class LocalizedExporter:
    def __init__(self,
            export_path: str,
            locale: Locale,
            localization_path: Optional[str] = None):
        """Provides an API to export files easily.

        Arguments:
            export_path -- base path for exports.
            locale -- locale used automatic assignation of localization path

        Keyword Arguments:
            localization_path -- possibly overrides the automatic assignation
                specified by locale (default: {None})
        """

        self._ensure_directory(export_path)

        lang = locale.selected
        if localization_path is None:
            _export_path = os.path.join(export_path, lang)
        else:
            _export_path = os.path.join(export_path, localization_path)
            logger.debug(f"Localization path for {lang=} is explicitly " +\
                f"set to {_export_path}"
            )

        self.export_path = self._ensure_directory(_export_path)


    @staticmethod
    def _ensure_directory(dir: str) -> str:
        if not os.path.exists(dir):
            logger.debug(f"Creating directory at {dir} ...")
            os.mkdir(dir)

        if not os.path.isdir(dir):
            logger.fatal(f"The path {dir} is not a directory. Aborting.")
            exit(-1)
        
        return dir


    def export(self, page: str, content: str):
        file_path = os.path.join(self.export_path, page + ".html")
        logger.info(f"Writing to {file_path}")

        with open(file_path, "w") as f:
            f.write(html_content)


class DataLoader:
    def __init__(self, data_path):
        self.data_path = data_path
    
    def load_yaml(self, file_name: str):
        """Tries to load a yaml file inside data_path.

        Returns:
            Empty dict if the file does not exist in data_path.
        """
        path = os.path.join(self.data_path, file_name)

        if not os.path.isfile(path):
            logger.info(f"{path} does not exist. skipping ...")
            return {}
        
        with open(path) as f:
            yaml_object = load(f.read(), Loader=Loader)
            if yaml_object is None:
                logger.warning(f"{path} exists but is empty.")
                return {}
            
            return {
                k.upper(): v
                for k, v in yaml_object.items()
            }

    def load_yaml_bulk(self, prefix=""):
        globals = {}
        for file in get_yamls(self.data_path):
            if file.startswith("_"):
                yaml_object = self.load_yaml(file)
                globals.update(yaml_object)
        return globals


def sanitize_page_list(
        pages: Optional[list[str]],
        templates_path: str,
        exclusion_prefix: Optional[str] = None) -> list[str]:

    if pages is None:
        files = get_jinjas(templates_path)
        if exclusion_prefix is not None:
            files = [f for f in files if not f.startswith(exclusion_prefix)]

        pages = [f.split(".")[0] for f in files]
        logger.debug(f"Automatically selected {pages} for baking.")
    else:
        pages = [p.split(".")[0] for p in pages]
        logger.debug(f"Loaded {pages} from config for baking.")
    return pages


if __name__ == "__main__":
    from config import *

    # Load pages if configured ...
    pages = sanitize_page_list(
        PAGES, TEMPLATES_PATH, PAGES_EXCLUSION_PREFIX
    )

    loader = DataLoader(DATA_PATH)

    # Initialize jinja2 environment
    env = Environment(
        loader=FileSystemLoader(TEMPLATES_PATH),
        autoescape=select_autoescape()
    )

    # Cache global data
    globals_ = loader.load_yaml_bulk(prefix=GLOBAL_DATA_PREFIX)

    now = datetime.utcnow()
    
    if os.path.exists(EXPORT_PATH):
        logger.info(f"{EXPORT_PATH=} exists, removing files ...")
        shutil.rmtree(EXPORT_PATH)

    # Populate the export path with static content if possible
    if os.path.isdir(STATIC_PATH):
        logger.info(
            f"{STATIC_PATH=} exists, copy to {EXPORT_PATH=} ..."
        )
        shutil.copytree(STATIC_PATH, EXPORT_PATH)

    for lang in LANGS:
        logger.info(f"Start baking {lang=} ...")

        locale = Locale(lang, LANGS)
        localizer = Localizer(
            locale=locale,
            globals=globals_
        )

        exporter = LocalizedExporter(
            export_path = EXPORT_PATH,
            locale = locale,
            localization_path = "" if (lang == DEFAUlT_LANG) else None
        )

        for page in pages:
            template = env.get_template(page + ".jinja")
            data = loader.load_yaml(page + ".yaml")

            html_content = localizer.bake(template, data,
                lang=lang,
                file=page + ".html",
                now=now
            )

            exporter.export(page, html_content)
