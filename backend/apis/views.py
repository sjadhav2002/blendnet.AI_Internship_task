from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.http import JsonResponse
import json
from django.contrib.auth import authenticate, login, logout

@csrf_exempt
def signin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

def signout(request):
    try:
        logout(request)
        return JsonResponse({'message': 'Logout successful'})
    except:
        return JsonResponse({'message': 'Logout Failed'})        
    

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        if not (username and password and first_name and last_name):  # Ensure all fields are provided
            return JsonResponse({'error': 'All fields are required.'}, status=400)
        #username/password checking
        try:
            user = User.objects.create_user(username=username, password=password, first_name=first_name, last_name=last_name, email = email)
            return JsonResponse({'status': 'success'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
    return JsonResponse({'status': 'success'}, status=201)

@csrf_exempt
def check_username(request, username):
    if User.objects.filter(username=username).exists():
            return JsonResponse({'available': False}, status=200)
    else:
        return JsonResponse({'available': True}, status=200)