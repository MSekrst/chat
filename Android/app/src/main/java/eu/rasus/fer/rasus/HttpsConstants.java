package eu.rasus.fer.rasus;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

public class HttpsConstants {

  public static String ADDRES = "https://chitchat.cf";

  public static HostnameVerifier HOSTNAME_VERIFIER = new HostnameVerifier() {

    @Override
    public boolean verify(String hostname, SSLSession session) {
      return true;
    }
  };

  public static TrustManager[] TRUST_ALL_CERTS = new TrustManager[]{new X509TrustManager() {

    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
      return new java.security.cert.X509Certificate[]{};
    }

    public void checkClientTrusted(X509Certificate[] chain,
                                   String authType) throws CertificateException {
    }

    public void checkServerTrusted(X509Certificate[] chain,
                                   String authType) throws CertificateException {
    }
  }};

  private static Socket socket = null;

  public static OkHttpClient getUnsafeOkHttpClient() {

    try {
      final SSLContext sslContext = SSLContext.getInstance("TLS");
      sslContext.init(null, HttpsConstants.TRUST_ALL_CERTS, new java.security.SecureRandom());
      final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

      OkHttpClient okHttpClient = new OkHttpClient();
      okHttpClient = okHttpClient.newBuilder().sslSocketFactory(sslSocketFactory).hostnameVerifier(HttpsConstants.HOSTNAME_VERIFIER).build();

      return okHttpClient;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public static Socket getSocket() {
    if (socket == null) {
      try {
        SSLContext mySSLContext = SSLContext.getInstance("TLS");
        mySSLContext.init(null, HttpsConstants.TRUST_ALL_CERTS, null);

        IO.Options opts = new IO.Options();
        opts.sslContext = mySSLContext;
        opts.hostnameVerifier = HttpsConstants.HOSTNAME_VERIFIER;

        socket = IO.socket(HttpsConstants.ADDRES, opts);
      } catch (Exception e) {
      }
    }
    return socket;
  }
}
