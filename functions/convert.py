#!/usr/bin/python3

import argparse
from PIL import Image

# 创建参数并传递参数
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="Sample image")
args = vars(ap.parse_args())

# 转换颜色通道至灰度
Image.open(args["image"]).convert("L").save(args["image"])