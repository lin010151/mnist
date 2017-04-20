import keras
from keras import backend as K
from keras import models
from keras.utils import np_utils
import numpy
import os
from PIL import Image
import sys

# 一些参数
batch_size = 128 # 批大小为 128
num_classes = 10 # 分 10 类，分别为 0 ~ 9
epochs = 10 # 进行 10 轮
img_rows, img_cols = 28, 28 # 图片大小为 28 行 28 列

# 加载数据
print("Loading new samples...")
samples_dir = "/var/www/html/mnist/samples/labelled/wrong/"
samples = os.listdir(samples_dir)
samples_num = len(samples)
if samples_num < batch_size:
	print("Your samples' quantity is less than batch size.")
	sys.exit("Re-train stopped.")
if K.image_data_format() == 'channels_first':
	data = numpy.empty((samples_num, 1, 28, 28), dtype="float32")
else:
	data = numpy.empty((samples_num, 28, 28, 1), dtype="float32")
label = numpy.empty((samples_num, ), dtype="uint8")
for i in range(samples_num):
	data[i, :, :, :] = numpy.asarray(Image.open(samples_dir + samples[i]), dtype="float32")
	label[i] = int(samples[i].split('_')[0])
data /= numpy.max(data)
data -= numpy.mean(data)
## 打印数据集的属性
print('Sample shape:', data.shape)
print(data.shape[0], 'new train samples.')

# 标签类型转换为 binary class matrices
label = np_utils.to_categorical(label, 10)

# 载入模型
model = models.load_model('model.h5')
print('Old model model.h5 loaded.')

# 训练模型，输入数据为 data，标签为 label，批大小为 batch_size，输出详细信息，用 (x_test, y_test) 对来验证
model.fit(data, label,
          batch_size=batch_size,
          epochs=epochs,
          verbose=1)

# 保存模型
model.save('model1.h5')
print('New Model saved to model_new.h5')