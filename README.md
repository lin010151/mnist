# 基于 Keras 深度学习框架的手写数字识别系统

该系统在 Ubuntu Server 16.04 上使用 Python 3 编译运行通过

### 需要的包

 * `keras` 用于核心内容
 * `h5py` 用于模型的保存
 * `pillow` 用于图像的处理
 * `Theano` 后端
 * `argparse`

### 使用须知

使用前做下面的事情：

 1. 检查组件和包的完整性
 2. 给 [functions](/functions) 里的 [convert.py](/functions/convert.py) 和 [predict.py](/functions/predict.py) 加上执行权限，必要时修改 [Shebang](https://zh.wikipedia.org/wiki/Shebang)
 3. 修改 [bridg.php](/bridg.php) 和 [label.php](/label.php) 里的 `$base_dir` 值，必要时修改 `$convert_cmd` 和 `$predict_cmd` 的值
 4. 如果 [functions](/functions) 里面没有 [model.h5](/functions/model.h5) 模型的话，需要先运行 [functions/train.py](/functions/train.py)

给使用 IIS 的建议：

 * 使用 Python Launcher
 * [PHP exec() command not executing](http://stackoverflow.com/questions/39240196/php-exec-command-not-executing)

### 参考

 * [Keras: Deep Learning library for Theano and TensorFlow](https://keras.io/)
 * [GitHub - wepe/MachineLearning: Basic Machine Learning and Deep Learning](https://github.com/wepe/MachineLearning)
