rsync -zarv $(find $1 -print | grep 'json\|html') $2
