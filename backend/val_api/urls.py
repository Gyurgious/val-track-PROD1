from django.urls import path
from . import views



urlpatterns = [
    path('overview', views.get_account_data, name='hello_world'),
    path('mmr', views.get_mmr_data, name="mmr"),
    path('matches', views.get_match_hist, name="hist"),
    path('cur_match', views.get_match_data, name="match"),
]