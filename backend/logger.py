"""
Configuration for the logger

The log file is rotated when it reaches max size

"""

import logging
from logging.handlers import RotatingFileHandler
from logging import DEBUG, INFO, ERROR
import pathlib
import copy
from config import get_config
import os

pid = os.getpid()


config = get_config()

max_bytes = 10_000_000

class ColoredFormatter(logging.Formatter):
    def __init__(self, *args, **kwargs):
        self.COLORS = {
            'WARNING': '\033[33m',  # Yellow
            'INFO': '\033[32m',    # Green
            'DEBUG': '\033[34m',   # Blue
            'CRITICAL': '\033[35m', # Magenta
            'ERROR': '\033[31m'    # Red
        }
        self.RESET = '\033[0m' # Reset to default
        super().__init__(*args, **kwargs)

    def format(self, record):
        colored_record = copy.copy(record)
        levelname = colored_record.levelname
        seq = self.COLORS.get(levelname, self.RESET)
        colored_levelname = f'{seq}{levelname:<8}{self.RESET}'
        colored_record.levelname = colored_levelname
        return super().format(colored_record)


def init_logger(name, log_file, level=logging.DEBUG):
    """
    Init a logger that writes to the console and a file
    """

    logger = logging.getLogger(name)
    logger.setLevel(level)
    formatter = logging.Formatter(f'%(asctime)s - %(levelname)-8s {pid} --- [%(filename)+15s:%(lineno)3d] | %(message)s')

    # for writing to a file
    fh = RotatingFileHandler(log_file, maxBytes=max_bytes, backupCount=5)
    fh.setFormatter(formatter)

    # Create a handler for writing to stdout (the console)
    cmd_formatter = ColoredFormatter(f'%(asctime)s - %(levelname)-8s {pid} --- [%(filename)+15s:%(lineno)3d] | %(message)s')
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(cmd_formatter)

    logger.addHandler(stream_handler)
    logger.addHandler(fh)
    return logger



aw_logger = init_logger("inventory-backend-logger", "./inventory-backend.log")
