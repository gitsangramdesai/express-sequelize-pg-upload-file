kill -9 $(lsof -t -i:3000)

psql -h localhost -p 5432 -U sangram   -d playground

password-sangram#81

--------------
echo "# express-sequelize-pg-upload-file" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:gitsangramdesai/express-sequelize-pg-upload-file.git
git push -u origin main