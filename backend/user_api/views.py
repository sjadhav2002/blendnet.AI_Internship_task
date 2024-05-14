from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render
import requests
import pandas as pd
from .models import Company, Watchlist, WatchlistCompany
from datetime import datetime
from django.contrib.auth.decorators import login_required


API_KEY = ["demo","5GU3VABUR3RB1EDS"]

companies = [
    {
    "symbol" :'IBM',
    "name":"International Business Machines Corp",
    "exchange": "NYSE",
    "assetType":"Stock"
    },
    {
    "symbol" :'MSFT',
    "name":"Microsoft Corporation",
    "exchange": "NASDAQ",
    "assetType":"Stock"
    },
    {
    "symbol" :'GOOG',
    "name":"Alphabet Inc - Class C",
    "exchange": "NASDAQ",
    "assetType":"Stock"
    },
    {
    "symbol" :'GPIQ',
    "name":"GOLDMAN SACHS NASDAQ-100 CORE PREMIUM INCOME ETF",
    "exchange": "NASDAQ",
    "assetType":"ETF"
    }
]

def get_companies():
    # global API_KEY
    # endpoint = 'https://www.alphavantage.co/query'
    # params = {
    #     'function': 'LISTING_STATUS',
    #     'apikey': API_KEY[1]
    # }
    # response = requests.get(endpoint, params=params)
    # if response.status_code == 200:
    #     Company.objects.all().delete()
    #     response_lines = response.text.split('\n')
    #     header = response_lines.pop(0)
    #     for line in response_lines:
    #         # Split the line into fields
    #         fields = line.split(',')
            
    #         # Extract values from the fields
    #         try:
    #             symbol = fields[0]
    #             name = fields[1]
    #             exchange = fields[2]
    #             assetType = fields[3]
    #             ipoDate = datetime.strptime(fields[4], '%Y-%m-%d') if fields[4] != 'null' else None
    #         except:
    #             continue

    global companies
    for company in companies:
            if not Company.objects.filter(symbol=company['symbol']).exists():
                # Create a Company object and assign values from the fields
                company = Company(
                    symbol=company['symbol'],
                    name=company['name'],
                    exchange=company['exchange'],
                    assetType=company['assetType']
                )
                try:
                    company.save()  # Save the Company object to the database
                except IntegrityError:
                    pass
    update_status()

def update_status():
    global API_KEY
    global companies
    for company in companies:
        endpoint =f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={company['symbol']}&interval=5min&apikey={API_KEY[0]}"
        response = requests.get(endpoint)
        data = response.json()
        time_data = data.get("Time Series (5min)")
        if time_data ==None:
            # continue
            endpoint =f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={company['symbol']}&interval=5min&apikey={API_KEY[1]}"
            response = requests.get(endpoint)
            data = response.json()
            time_data = data.get("Time Series (5min)")
        data_rows = []
        for data in time_data:
            time = pd.Timestamp(data)
            open_price = float(time_data[data]["1. open"])
            high_price = float(time_data[data]["2. high"])
            low_price = float(time_data[data]["3. low"])
            close_price = float(time_data[data]["4. close"])
            volume = int(time_data[data]["5. volume"])
            
            # Create a dictionary for the row
            row = {
                "time": time,
                "open": open_price,
                "high": high_price,
                "low": low_price,
                "close": close_price,
                "volume": volume
            }
            
            # Append the row dictionary to the list
            data_rows.append(row)

        # Create DataFrame from the list of dictionaries
        df = pd.DataFrame(data_rows)
        df['time'] = pd.to_datetime(df['time'])
        max_date = df['time'].max()
        start_date = max_date - pd.Timedelta(days=10)
        
        df_today = df[df['time'].dt.date == max_date.date()].sort_values(by='time', ascending=False)
        df_10day = df[(df['time'] >= start_date) & (df['time'] <= max_date)].sort_values(by='time', ascending=False)
        
        high_today = df_today['high'].max()
        low_today = df_today['low'].min()
        
        start_today = df_today['time'].min()
        end_today = df_today['time'].max()
        perf_today = df_today[df_today['time'] == start_today]['open'].iloc[0] - df_today[df_today['time'] == end_today]['close'].iloc[0]
        
        
        high_10day = df_today['high'].max()
        low_10day = df_today['low'].min()
        
        start_10day = df_today['time'].min()
        end_10day = df_today['time'].max()
        perf_10day = df_10day[df_10day['time'] == start_10day]['open'].iloc[0] - df_10day[df_10day['time'] == end_10day]['close'].iloc[0]
        
        high_30day = df_today['high'].max()
        low_30day = df_today['low'].min()
        
        start_30day = df['time'].min()
        end_30day = df['time'].max()
        perf_30day = df[df['time'] == start_30day]['open'].iloc[0] - df[df['time'] == end_30day]['close'].iloc[0]
        
        company = Company.objects.get(symbol = company['symbol'])
        company.low_today = low_today
        company.low_10day = low_10day
        company.low_30day = low_30day
        company.high_today = high_today
        company.high_10day = high_10day
        company.high_30day = high_30day
        company.perf_today = perf_today
        company.perf_10day = perf_10day
        company.perf_30day = perf_30day
        company.save()
   

def dashboard(request):
    user = request.user
    print(user)
    user_watchlists = list(Watchlist.objects.filter(user = user).values())
    watchlist_companies = []
    for item in user_watchlists:
        watchlist = item["name"]
        watchlist_id = item['id']
        companies = WatchlistCompany.objects.filter(watchlist_id = watchlist_id).values()
        company_list =[]
        for company in companies:
            comp_data = Company.objects.get(symbol = company['company_id'])
            comp_data = {
                "name": comp_data.name,
                "symbol":comp_data.symbol,
                "perf_today": comp_data.perf_today,
                "perf_10day": comp_data.perf_10day,
                "perf_30day": comp_data.perf_30day,
                "high_today": comp_data.high_today,
                "high_10day": comp_data.high_10day,
                "high_30day": comp_data.high_30day,
                "low_today": comp_data.low_today,
                "low_10day": comp_data.low_10day,
                "low_30day": comp_data.low_30day
            }
            company_list.append(comp_data)
        
        watchlist_companies.append(company_list)
    
    
    data = {
        'user' : user.username,
        'watchlists' : user_watchlists,
        'watchlist_companies':watchlist_companies
    }
    return JsonResponse(data)

def checkuser(request):
    print(request.user.username)
    return JsonResponse({'msg':request.user.username})

# get_companies()