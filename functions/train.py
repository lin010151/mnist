import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K

# 一些参数
batch_size = 128 # 批大小为 128
num_classes = 10 # 分 10 类，分别为 0 ~ 9
epochs = 10 # 进行 10 轮
img_rows, img_cols = 28, 28 # 图片大小为 28 行 28 列

# 加载并处理数据
## 加载数据
print("Loading samples...")
(x_train, y_train), (x_test, y_test) = mnist.load_data()

## 判断 image_data_format 参数来设置 input_shape，颜色通道为 1
if K.image_data_format() == 'channels_first':
    x_train = x_train.reshape(x_train.shape[0], 1, img_rows, img_cols)
    x_test = x_test.reshape(x_test.shape[0], 1, img_rows, img_cols)
    input_shape = (1, img_rows, img_cols)
else:
    x_train = x_train.reshape(x_train.shape[0], img_rows, img_cols, 1)
    x_test = x_test.reshape(x_test.shape[0], img_rows, img_cols, 1)
    input_shape = (img_rows, img_cols, 1)

x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255

## 打印数据集的属性
print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')

## 类向量转换为二进制类矩阵
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

# 建立模型
## 使用 Sequential 模型来建立 CNN 模型
model = Sequential()

## 卷积层，4 个卷积核，每个卷积核大小为 5 * 5，对边界数据不处理，激活函数为 tanh，数据格式为 input_shape
model.add(Conv2D(4, (5, 5), padding='valid', activation='tanh', input_shape=input_shape))

## 卷积层，8 个卷积核，每个卷积核大小为 3 * 3，对边界数据不处理，激活函数为 tanh
model.add(Conv2D(8, (3, 3), padding='valid', activation='tanh'))

## 池化层，最大值池化大小为 2 * 2
model.add(MaxPooling2D(pool_size=(2, 2)))

## 卷积层，16 个卷积核，每个卷积核大小为 3 * 3，对边界数据不处理，激活函数为 tanh
model.add(Conv2D(16, (3, 3), padding='valid', activation='tanh'))

## 池化层，最大值池化大小为 2 * 2
model.add(MaxPooling2D(pool_size=(2, 2)))

## Flatten 层，用来从卷积层过渡到全连接层
model.add(Flatten())

## 全连接层
### Dence 层，128个神经元节点，激活函数为 tanh，权值初始化方法为 normal
model.add(Dense(128, activation='tanh', kernel_initializer="normal"))

### Dence 层，10个神经元节点，激活函数为 softmax，权值初始化方法为 normal
#### 输出 10 个类别（0 ~ 9）
model.add(Dense(num_classes, activation='softmax', kernel_initializer="normal"))

# 编译模型
## 设置随机梯度下降参数，学习率为 0.05，学习率衰减值为 0.000001，nesterov 动量为 0.9，
sgd = keras.optimizers.SGD(lr=0.05, decay=1e-6, momentum=0.9, nesterov=True)
## 损失函数为 categorical crossentropy，随机梯度下降优化，精确度量模型性能
model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=sgd,
              metrics=['accuracy'])

# 训练模型，输入数据为 x_train，标签为 y_train，批大小为 batch_size，输出详细信息，用 (x_test, y_test) 对来验证
model.fit(x_train, y_train,
          batch_size=batch_size,
          epochs=epochs,
          verbose=1,
          validation_data=(x_test, y_test))

# 评估模型，输出评估过程，并打印结果
score = model.evaluate(x_test, y_test, verbose=1)
print('Test loss:', score[0])
print('Test accuracy:', score[1])

# 保存模型
model.save('model.h5')
print('Model saved to model.h5.')