from datetime import date
import time
from requests import request
import Services


def textVal(Val):
    try:
        if type(Val) == str:
            return Val  # returns the string if the value matches string
    except Exception:
        raise("Something went wrong!\n The sent value\'s type must be \"str\"")
