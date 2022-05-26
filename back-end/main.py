import sys

# adding Folder_2 to the system path
sys.path.insert(0, 'app')
from ServiceRoutes import app



if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")
