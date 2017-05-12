# 基于 Keras 深度学习框架的手写数字识别系统

Ubuntu 16.04 + Apache 2 + PHP 7 + Python 3 成功

Windows 10 + IIS 10 + PHP 7 + Python 3 成功

### 需要的包

 * `keras` 用于核心内容
 * `h5py` 用于模型的保存
 * `pillow` 用于图像的处理
 * `argparse` 用于支持命令行选项功能
 * [`numpy + mkl`](http://www.lfd.uci.edu/~gohlke/pythonlibs/#numpy)（Windows）

### 使用须知

使用前做下面的事情：

 1. 检查组件和包的完整性
 2. 给 [functions](/functions) 里的 [convert.py](/functions/convert.py) 和 [predict.py](/functions/predict.py) 加上执行权限，同时修改  [Shebang](https://zh.wikipedia.org/wiki/Shebang)（Linux）
 4. 修改 [bridg.php](/bridg.php) 和 [label.php](/label.php) 里的 `$base_dir` 值
 5. 如果 [functions](/functions) 里面没有 [model.h5](/functions/model.h5) 模型的话，需要先运行 [functions/train.py](/functions/train.py)

给使用 Windows + IIS 的建议：

 * 关联好 `.py` 文件格式（推荐用 Python Launcher）
 * [PHP exec() 命令不执行？](http://stackoverflow.com/questions/39240196/php-exec-command-not-executing)
 * 相应的用户需要有完全控制 `%WINDIR%\System32\config\systemprofile` 的权限
 * 需要将 `keras.json` 放入 `%WINDIR%\System32\config\systemprofile\.keras`
 * 在识别前需要将 [`keras\backend\__init__.py`](https://github.com/fchollet/keras/blob/master/keras/backend/__init__.py) 里使用 `sys.stderr.write()` 方法的语句注释掉（训练时可以不用）

### 参考

 * [Keras: Deep Learning library for Theano and TensorFlow](https://keras.io/)
 * [GitHub - wepe/MachineLearning: Basic Machine Learning and Deep Learning](https://github.com/wepe/MachineLearning)
