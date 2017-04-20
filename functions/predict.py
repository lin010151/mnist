#!/usr/bin/python3

import argparse
import keras
import numpy
import PIL
from keras.models import load_model

# 创建参数并传递参数
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True, help="Sample image")
ap.add_argument("-m", "--model", required=True, help="Trained model")
args = vars(ap.parse_args())

# 转换测试图片为数组
sample = numpy.array(PIL.Image.open(args["image"]))
sample = numpy.expand_dims(sample, axis=0)
sample = numpy.expand_dims(sample, axis=0)

# 载入模型
model = load_model(args["model"])

# 预测图片
proba = model.predict_proba(sample, verbose=0)
result = model.predict_classes(sample, verbose=0)

# 输出预测结果及概率
proba = numpy.nditer(proba, flags=['f_index'])
print('Class\tProbability (%)')
while not proba.finished:
	print('%d\t%.6f' % (proba.index, proba[0] * 100)),
	proba.iternext()
print('%d' % result)