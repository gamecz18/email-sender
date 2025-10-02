package utb.fai;

import java.net.*;
import java.io.*;

public class EmailSender {
  /*
   * Constructor opens Socket to host/port. If the Socket throws an exception
   * during opening,nj
   * the exception is not handled in the constructor.
   */
  Socket socket;

  public EmailSender(String host, int port) throws UnknownHostException, IOException {
    try {

      socket = new Socket(host, port);
      OutputStream out = socket.getOutputStream();
      InputStream in = socket.getInputStream();
      String zprava = "EHLO localhost\r\n";

      byte[] data = zprava.getBytes();
      byte[] inputBuffer = new byte[1024];
      int inputLength = 0;

      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      out.write(data, 0, data.length);
      out.flush();
      Thread.sleep(500);

      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      socket.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  /*
   * Sends email from an email address to an email address with some subject and
   * text.
   * If the Socket throws an exception during sending, the exception is not
   * handled by this method.
   */
  public void send(String from, String to, String subject, String text) throws IOException {

    try {

      byte[] inputBuffer = new byte[1024];
      int inputLength = 0;
      String zprava = "MAIL FROM: i_schober@utb.cz\r\n";
      byte[] data = zprava.getBytes();

      OutputStream out = socket.getOutputStream();
      InputStream in = socket.getInputStream();
      out.write(data, 0, data.length);
      out.flush();

      Thread.sleep(500);
      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      zprava = "RCPT TO: i_schober@utb.cz\r\n";
      data = zprava.getBytes();
      out.write(data, 0, data.length);
      out.flush();

      Thread.sleep(500);
      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      Thread.sleep(500);

      zprava = "DATA\r\n";
      data = zprava.getBytes();
      out.write(data, 0, data.length);
      out.flush();

      Thread.sleep(500);
      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      // Posílání obsahu emailu
      zprava = "From: i_schober@utb.cz\r\n" +
          "To: i_schober@utb.cz\r\n" +
          "Subject: Test email\r\n" +
          "\r\n" +
          "Toto je obsah emailu.\r\n" +
          ".\r\n";
      data = zprava.getBytes();
      out.write(data, 0, data.length);
      out.flush();

      Thread.sleep(500);
      while (in.available() > 0) {
        inputLength = in.read(inputBuffer, 0, 1024);
        System.out.write(inputBuffer, 0, inputLength);

      }

      Thread.sleep(500);
    } catch (Exception e) {
      // TODO: handle exception
    }

  }

  /*
   * Sends QUIT and closes the socket
   */
  public void close() {

  }
}
