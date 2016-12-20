package eu.rasus.fer.chat;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.stetho.Stetho;

public class Application extends android.app.Application {

  public void onCreate() {
    super.onCreate();
    Stetho.initializeWithDefaults(this);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
  }
}
