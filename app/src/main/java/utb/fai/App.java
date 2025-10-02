package utb.fai;

public class App {

    public static void main(String[] args) {
        // TODO: Implement input parameter processing
        
        try {
            
            String host = args[0];
            int port = Integer.parseInt(args[1]);
            
            EmailSender sender = new EmailSender(host, port);
           sender.send(args[3], args[4], args[5], args[6]);
            sender.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
