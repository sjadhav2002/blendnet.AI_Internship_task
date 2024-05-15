from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
import requests, json
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

@login_required
def dashboard(request):
    global companies
    user = request.user
    try:
        user_watchlists = list(Watchlist.objects.filter(user = user).order_by('name').values())
    except:
        user_watchlists =[]
        
    try:
        watchlist_companies = {}
        for item in user_watchlists:
            watchlist = item["name"]
            watchlist_id = item['id']
            companies_list = WatchlistCompany.objects.filter(watchlist_id = watchlist_id).values()
            company_list =[]
            for company in companies_list:
                comp_data = Company.objects.get(symbol = company['company_id'])
                comp_data = {
                    "watchlist":watchlist ,
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
            
            watchlist_companies[watchlist] = company_list
        
        default_companies = []
        for watchlist_item in watchlist_companies:
            for item in watchlist_companies[watchlist_item]:
                default_companies.append(item)
        
        max_perf_today = max(default_companies, key=lambda x: x['perf_today'])
        min_perf_today = min(default_companies, key=lambda x: x['perf_today'])
        max_perf_10day = max(default_companies, key=lambda x: x['perf_10day'])
        min_perf_10day = min(default_companies, key=lambda x: x['perf_10day'])
        max_perf_30day = max(default_companies, key=lambda x: x['perf_30day'])
        min_perf_30day = min(default_companies, key=lambda x: x['perf_30day'])
        perf_metrics = {
        'max_perf_today':max_perf_today,
        'min_perf_today':min_perf_today,
        'max_perf_10day':max_perf_10day,
        'min_perf_10day':min_perf_10day,
        'max_perf_30day':max_perf_30day,
        'min_perf_30day':min_perf_30day
    }
        data = {
        'user' : user.username,
        'watchlists' : user_watchlists,
        'watchlist_companies':watchlist_companies,
        'allCompanies': companies,
        'perf_metrics': perf_metrics
        
    }
    except Exception as e:
        print(e)
        watchlist_companies ={}
        data = {
        'user' : user.username,
        'watchlists' : user_watchlists,
        'watchlist_companies':watchlist_companies,
        'allCompanies': companies,
        
    }
    return JsonResponse(data)

@login_required
def getWatchlistPerf(request):
    if request.method =="POST":
        user = request.user
        data = json.loads(request.body)
        try:
            watchlist_id = data.get("watchlist")
            companiesInWatchlist = list(WatchlistCompany.objects.filter(watchlist_id = watchlist_id).values())
            default_companies = []
            for item in companiesInWatchlist:
                company = Company.objects.filter(symbol=item['company_id']).values().get()
                print(company)
                default_companies.append(company)
                
            max_perf_today = max(default_companies, key=lambda x: x['perf_today'])
            min_perf_today = min(default_companies, key=lambda x: x['perf_today'])
            max_perf_10day = max(default_companies, key=lambda x: x['perf_10day'])
            min_perf_10day = min(default_companies, key=lambda x: x['perf_10day'])
            max_perf_30day = max(default_companies, key=lambda x: x['perf_30day'])
            min_perf_30day = min(default_companies, key=lambda x: x['perf_30day'])
            perf_metrics = {
            'max_perf_today':max_perf_today,
            'min_perf_today':min_perf_today,
            'max_perf_10day':max_perf_10day,
            'min_perf_10day':min_perf_10day,
            'max_perf_30day':max_perf_30day,
            'min_perf_30day':min_perf_30day
            }
            data = {
            'perf_metrics': perf_metrics   
            }
        except:
            data = {}
        
        
    return JsonResponse(data)

@login_required
def addWatchlist(request):
    if request.method =="POST":
        user = request.user
        data = json.loads(request.body)
        watchlist_name = data.get("name")
        watchlist = Watchlist()
        watchlist.name = watchlist_name
        watchlist.user = user
        try:
            watchlist.save()
            return JsonResponse({'msg':"success"})
        except:
            return JsonResponse({'msg':"failed"})
    return JsonResponse({'error': 'Method not allowed'}, status=405)
        


@login_required
def removeWatchlist(request):
    if request.method =="POST":
        user = request.user
        data = json.loads(request.body)
        watchlist_names = data.get("selectedWatchlists")
        print(watchlist_names)
        for name in watchlist_names:
            try:
                watchlistToDelete = get_object_or_404(Watchlist, user=user, name=name)
                watchlistToDelete.delete()
                return JsonResponse({'msg':"success"})
            except:
                return JsonResponse({'msg':"failed"})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
def addCompanyToWatchlist(request):
    if request.method =="POST":
        user = request.user
        data = json.loads(request.body)
        try:
            companydata = data.get("companydata")
            updatedwatchlist = data.get('updatedwatchlist')
            
            watchlist = get_object_or_404(Watchlist, user=user, name=updatedwatchlist)
            companydata = companydata[updatedwatchlist]
            existing_symbol_list = list(WatchlistCompany.objects.filter(watchlist = watchlist).values_list('company_id',flat=True))
            
            new_symbol_list =[]
            for item in companydata:
                new_symbol_list.append(item['symbol'])
            
            updated_set = set(new_symbol_list)
            original_set = set(existing_symbol_list)
            
            symbols_to_remove = list(original_set - updated_set)
            symbols_to_add = list(updated_set - original_set)
            
            if len(symbols_to_remove) !=0:
                for item in symbols_to_remove:
                    watchlist_item = get_object_or_404(WatchlistCompany, company_id = item, watchlist=watchlist)
                    print(f"removing{item}" )
                    watchlist_item.delete()
                    
            if len(symbols_to_add) !=0:
                for item in symbols_to_add:
                    watchlist_item = WatchlistCompany()
                    watchlist_item.company = Company.objects.get(symbol = item)
                    watchlist_item.watchlist = watchlist
                    watchlist_item.save()
            
            return JsonResponse({'msg':"success"})
        except Exception as e:
            print(e)
            return JsonResponse({'msg':"failed"})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
def getCompanyGraph(request):
    global API_KEY
    if request.method =="POST":
        data = json.loads(request.body)
        company = data.get("selectedCompany")
        endpoint =f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={company}&interval=5min&apikey={API_KEY[0]}"
        response = requests.get(endpoint)
        data = response.json()
        time_data = data.get("Time Series (5min)")
        if time_data ==None:
            endpoint =f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={company}&interval=5min&apikey={API_KEY[1]}"
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
            row ={
                'x' : pd.to_datetime(time),
                'y' : [open_price,high_price,low_price,close_price]
            }
            
            # Append the row dictionary to the list
            data_rows.append(row)
        company_perf = Company.objects.filter(symbol = company).values().get()

        return JsonResponse({'candlestick_data': data_rows, 'perf_metrics':company_perf})



@login_required
def checkuser(request):
    print(request.user.username)
    return JsonResponse({'msg':request.user.username})









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
   
# get_companies()