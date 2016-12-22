package eu.rasus.fer.chat;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.stetho.Stetho;

public class Application extends android.app.Application {

  public static String USERNAME;
  public static String TOKEN;

  public void onCreate() {
    super.onCreate();
    Stetho.initializeWithDefaults(this);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
  }
}
