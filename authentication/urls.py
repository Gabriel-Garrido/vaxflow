from django.urls import path
from .views import CustomTokenObtainPairView
from .views import CreateUserView, UserDetailsView, LoginView, LogoutView

urlpatterns = [
    path('signup/', CreateUserView.as_view(), name='signup'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),    
    
    ]
