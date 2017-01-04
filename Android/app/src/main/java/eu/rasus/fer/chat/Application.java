package eu.rasus.fer.chat;

import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.stetho.Stetho;
import com.github.nkzawa.socketio.client.Socket;

public class Application extends android.app.Application {

  public static String USERNAME;
  public static String TOKEN;

  public static Socket SOCEKT;

  public void onCreate() {
    super.onCreate();
    Stetho.initializeWithDefaults(this);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
  }
}
