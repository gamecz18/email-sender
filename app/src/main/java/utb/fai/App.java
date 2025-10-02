package utb.fai;

public class App {

    public static void main(String[] args) {
        // TODO: Implement input parameter processing
        
         if (args.length < 6) {
            System.err.println("Usage: java -jar app.jar <host> <port> <from> <to> <subject> <body>");
            System.exit(1);
            return;
        }
        try {
            
            String host = args[0];
            int port = Integer.parseInt(args[1]);
            
            EmailSender sender = new EmailSender(host, port);
           sender.send(args[2], args[3], args[4], args[5]);
            sender.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
