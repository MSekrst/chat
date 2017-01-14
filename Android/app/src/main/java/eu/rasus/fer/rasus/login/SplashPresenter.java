package eu.rasus.fer.rasus.login;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;

import eu.rasus.fer.rasus.Application;
import eu.rasus.fer.rasus.MainActivity;

public class SplashPresenter {

  SplashView mSplashView;

  public SplashPresenter(SplashView splashView) {
    mSplashView = splashView;
  }

  public void startApp() {
    SharedPreferences prefs = mSplashView.getSharedPreferences("data", Context.MODE_PRIVATE);
    String username = prefs.getString("USERNAME", "");
    String token = prefs.getString("TOKEN", "");

    Intent intent;
    if (username.isEmpty() || token.isEmpty()) {
    intent = new Intent(mSplashView, LoginView.class);
    }
    else {
      Application.USERNAME =  username;
      Application.TOKEN = token;
      intent = new Intent(mSplashView, MainActivity.class);
    }

    mSplashView.startActivity(intent);
    mSplashView.finish();
  }

  public void mockWait() {
    Handler handler = new Handler();
    handler.postDelayed(new Runnable() {

      @Override
      public void run() {
        startApp();
      }
    }, 2000);
  }
}
