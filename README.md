# blendnet.AI_Internship_task

# Setup 
1. Clone repository using- https://github.com/sjadhav2002/blendnet.AI_Internship_task.git

# Setup Backend
1. Open a terminal.
2. Change directory to backend: 
    - cd ./backend
3. Create virtual environment: 
    - pip install virtualenv
    - virtualenv env
    - .\env\Scripts\activate
4. Install all dependencies:
    - pip install -r requirements.txt
5. Install and setup Postgresql
6. Open backend\Settings.py and update the database details with your credentials
    - NAME - Database name
    - USER - username
    - PASSWORD - password
    - HOST - DB Host
    - PORT - DB Port   
7. open user_api\views.py file
    - update the value of API_KEY global variable with your API key(or keep same My key has limit of 25 requests per day)

8. run command
    - python manage.py makemigrations
    - python manage.py migrate
9. Remove the comment from get_companies() in user_api\views.py file last line
10. run command
    - python manage.py runserver


# setup FrontEnd
1. Open a terminal.
2. Change directory to frontend: 
    - cd ./frontend
4. run
    - npm install
5. run
    - npm start


# Documentation about both Backend and Frontend is given in Documentation.pdf