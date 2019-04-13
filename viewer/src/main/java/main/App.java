package main;

import java.awt.Color;
import java.awt.Desktop;
import java.awt.GridLayout;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;

import panel.CRPanel;
import panel.HomePanel;
import panel.LoginPanel;
import tool.HTTPController;
import tool.Response;

/**
 * @purpose used as the container of the panels
 */
public class App extends JFrame {
    private static final long serialVersionUID = 1L;
    private final String Dir = System.getProperty("java.class.path") + "/../";
    private String webAppURL = null;
    private String loadEmail = null;
    private HTTPController http = null;
    private JPanel current = null;
    private HomePanel home = null;
    private User user = null;

    public App() {
        this.http = new HTTPController();
        this.setIconImage(new ImageIcon(this.getDir() + "img/favicon.png").getImage());
        this.getContentPane().setBackground(Color.WHITE);
        JLabel loading = new JLabel("<html><p style='font-size:30px;'>Loading......</p></html>",
                new ImageIcon(this.getDir() + "img/logo.png"), JLabel.CENTER);
        loading.setHorizontalTextPosition(JLabel.LEFT);

        this.getContentPane().add(loading);
        this.display();

        // load infromation
        Thread worker = new Thread(() -> {
            this.loadConfig();
            // try to loading preset user, go to login page if failed
            if (!this.setUser()) {
                this.toLogin();
            }
            this.getContentPane().remove(loading);
        });
        worker.start();
    }

    // display frame
    private void display() {
        this.setTitle("CRViewer");
        this.setSize(550, 900);
        this.setLocationRelativeTo(null);
        this.setResizable(true);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // allow x to exit the application
        this.setVisible(true);
        this.setResizable(false);

    }

    // http request
    public HTTPController http() {
        return this.http;
    }

    // get directory
    public String getDir() {
        return this.Dir;
    }

    // set user
    public Boolean setUser() {
        if (this.http().getToken() != null) {
            // get user from server
            Response response = this.http().getUser();
            // if server respond ok, set up and go to home
            if (response.getStatus() == 200) {
                this.user = new User(response.getJson());
                this.saveConfig();
                this.toHome();
                return true;
            }
        }
        return false;
    }

    /**
     * @return the user
     */
    public User getUser() {
        return user;
    }

    /**
     * @return the user email
     */
    public String getUserEmail() {
        if (user != null) {
            return user.getEmail();
        }
        return null;
    }

    /**
     * @return the web app url
     */
    public String getWebAppURL() {
        return this.webAppURL;
    }

    // remove current panel and display the target panel
    private void swapPanel(JPanel next) {
        // remove current if it is not null
        if (this.current != null) {
            this.getContentPane().remove(this.current);
        }
        // add new current panel
        this.current = next;
        this.getContentPane().add(this.current);
        this.revalidate();
        this.repaint();
    }

    // go to login panel
    public void toLogin() {
        JPanel loginPane = new LoginPanel(this, this.loadEmail);
        // clear existing user information
        if (this.current != null) {
            this.http().clearToken();
            this.saveConfig();
            this.user = null;
            this.home = null;
        }
        this.swapPanel(loginPane);
    }

    // go to home panel
    public void toHome() {
        if (this.home == null) {
            this.home = new HomePanel(this);
        }
        this.swapPanel(home);
    }

    // go to change request panel
    public void toChangeRequest(int crID) {
        this.swapPanel(new CRPanel(this, crID));
    }

    // open webpage
    public boolean openWebpage() {
        Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
        if (desktop != null && desktop.isSupported(Desktop.Action.BROWSE)) {
            try {
                desktop.browse(new URI(this.webAppURL));
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    // convert empty string to null value
    private String emptyToNull(String val) {

        if (val == null || val.trim().equals("")) {
            return null;
        }
        return val;
    }

    // convert empty string to null value
    private String nullToNull(String val) {
        if (val.trim().equals("null")) {
            return null;
        }
        return val;
    }

    // set config dialog
    public void setConfig() {

        JTextField txtServiceURL = new JTextField(this.http.getBaseURL(), 20);
        JTextField txtWebAppURL = new JTextField(this.webAppURL, 20);
        JPanel myPanel = new JPanel(new GridLayout(2, 2, 0, 5));
        myPanel.add(new JLabel("Service URL: "));
        myPanel.add(txtServiceURL);
        myPanel.add(new JLabel("Web App URL: "));
        myPanel.add(txtWebAppURL);

        int result = JOptionPane.showConfirmDialog(null, myPanel, "Configuation", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            this.webAppURL = txtWebAppURL.getText();
            this.http.setBaseURL(txtServiceURL.getText());
            this.saveConfig();
        }
    }

    // Write information into data file
    private void saveConfig() {
        try {
            BufferedWriter bw = new BufferedWriter(new FileWriter(Dir + "config"));
            bw.write("Email=" + emptyToNull(getUserEmail()) + "\n");
            bw.write("Token=" + emptyToNull(http.getToken()) + "\n");
            bw.write("ServiceURL=" + emptyToNull(http.getBaseURL()) + "\n");
            bw.write("WebAppURL=" + emptyToNull(getWebAppURL()) + "\n");
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Write information into data file
    private void loadConfig() { // Read data from file
        try {
            BufferedReader br = new BufferedReader(new FileReader(Dir + "config"));
            String data;
            while ((data = br.readLine()) != null) {
                String[] split = data.split("=");
                switch (split[0]) {
                case "Email":
                    this.loadEmail = nullToNull(split[1]);
                    break;
                case "Token":
                    this.http.setToken(nullToNull(split[1]));
                    break;
                case "ServiceURL":
                    this.http.setBaseURL(nullToNull(split[1]));
                    break;
                case "WebAppURL":
                    this.webAppURL = nullToNull(split[1]);
                    break;
                }
            }

            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}