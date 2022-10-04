import * as child_process from 'child_process';
import * as path from 'path';
import fs from 'fs';

const isExist = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};
const copyFile = (sourcePath: string, targetPath: string, extraConfig?: { isRecursivelyCheck?: boolean }) => {
    const { isRecursivelyCheck = false } = extraConfig || {};
    isExist(targetPath);

    const sourceFile = fs.readdirSync(sourcePath, { withFileTypes: true });

    sourceFile.forEach((file) => {
        const newSourcePath = path.resolve(sourcePath, file.name);
        const newTargetPath = path.resolve(targetPath, file.name);
        console.log(`[ 拷贝${file.isDirectory() ? '目录' : '文件'} ] 源路径 ${newSourcePath} => 终路径 ${newTargetPath}`);
        if (file.isDirectory()) {
            isExist(newTargetPath);
            isRecursivelyCheck && copyFile(newSourcePath, newTargetPath);
        } else {
            fs.copyFileSync(newSourcePath, newTargetPath);
        }
    });
};

const scriptMap = new Map();

scriptMap.set('generate:yeomanTemplate', () => {
    try {
        child_process.execSync('npm run clean:yeoman');
        console.log('[ 清理旧文件 ] 清理 yeoman template 目录 成功');
    } catch (e) {
        console.log('[ 清理旧文件 ] 清理 yeoman template 目录 失败');
        console.log(e);
    }
    copyFile(path.resolve('./'), path.resolve('.', 'generator', 'app', 'templates'));
    copyFile(path.resolve('./src'), path.resolve('.', 'generator', 'app', 'templates', 'src'), { isRecursivelyCheck: true });
});

if (scriptMap.has(process.env.SCRIPT_NAME)) {
    console.log(`[ 匹配命令脚本 ] 已找到 ${process.env.SCRIPT_NAME} 对应脚本，开始执行`);
    const targetScript = scriptMap.get(process.env.SCRIPT_NAME);
    if (typeof targetScript === 'function') {
        targetScript();
    }
} else {
    console.log(`[ 匹配命令脚本 ]未找到 ${process.env.SCRIPT_NAME} 对应脚本，停止执行`);
}
