#/bin/bash!
branch=`git rev-parse --abbrev-ref HEAD`

# exit

echo '--》复制js文件'
# js文件
rm -r ./js
cp -r ./koa/static/js/ ./js/

echo '--> 压缩js文件,打上md5'
gulp minify::js
rm ./js/app.js

echo '--> 生成map'
node getMap.js

echo '--》复制database文件'
# database文件
rm -r ./database/
cp -r ./koa/static/database/ ./database/

echo '-->渲染jade文件到index.html'
node render_index.js

echo '--> pull: 当前分支'$branch
git fetch
git merge origin $branch

echo '--》git提交文件'
git add .
git commit -m '博客更新'

echo '--》开始提交代码'
git push origin master
echo '--》代码提交完成'
