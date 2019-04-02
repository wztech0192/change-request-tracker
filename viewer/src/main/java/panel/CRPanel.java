package panel;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.ScrollPaneConstants;

import org.json.JSONException;
import org.json.JSONObject;

import main.App;
import panel.nested.cr.CRHistory;
import panel.nested.cr.CRMessage;
import tool.CRTStyle;
import tool.Loader;
import tool.Response;

/**
 * ChangeRequestDetail Panel
 */
public class CRPanel extends AppPanel implements ActionListener {

    private static final long serialVersionUID = 1L;
    private int id;
    private Loader loader;
    private JSONObject changeRequest = null;
    private JButton lblStatus = null;
    private JLabel[] lblDetail = new JLabel[6];
    private JButton[] statusBar = new JButton[4];
    private JPanel centerPane = null;
    private String oldStatus = null;
    private JLabel lblContent[] = null;

    public CRPanel(App app, int id) {
        super(app);
        loader = new Loader(3);
        loader.setActive(true, 0);
        this.id = id;
        this.setLayout(new BorderLayout());
        this.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        this.setBackground(Color.WHITE);

        this.getChangeRequest();

    }

    // auto refresh change request detail using background thread.
    private void getChangeRequest() {
        Thread worker = new Thread(() -> {
            while (loader.isActive(0)) {
                try {
                    Response response = app.http().getCRDetail(id);
                    // if server repsonse 200 ok, set data
                    if (response.getStatus() == 200) {
                        changeRequest = response.getJson();
                        setData();
                    } else {
                        // else return home and alert user
                        loader.setActive(false, 0);
                        app.toHome();
                        JOptionPane.showMessageDialog(this,
                                "<html><h3 style='color:red;'>Invalid access to the resource!</h3></html>");
                    }
                    // sleep for 4 seconds
                    Thread.sleep(2000);
                } catch (InterruptedException | JSONException e) {
                    e.printStackTrace();
                }
            }
        });
        worker.start();
    }

    // set change request data
    private void setData() throws JSONException {
        if (oldStatus == null) {
            this.add(this.getTopPanel(), BorderLayout.NORTH);
            this.add(this.getCenterPanel(), BorderLayout.CENTER);
        }
        String newStatus = this.changeRequest.getString("status");
        // update status and component color if new status is differetn than the old one
        if (!newStatus.equals(oldStatus)) {
            oldStatus = newStatus;
            Color statusColor = CRTStyle.getStatusColor(newStatus);
            this.setStatusBar(newStatus, statusColor);
            this.lblStatus.setText(newStatus);
            this.lblStatus.setBackground(statusColor);
            this.centerPane.setBorder(BorderFactory.createMatteBorder(5, 1, 1, 1, statusColor));
            this.lblDetail[0].setText(this.changeRequest.getString("clientName"));
            this.lblDetail[1].setText("" + this.changeRequest.get("id"));
            this.lblDetail[4].setText(this.changeRequest.getString("created_at"));
        }
        this.lblDetail[2].setText("" + this.changeRequest.get("totalMessage"));
        this.lblDetail[3].setText("" + this.changeRequest.get("totalHistory"));
        this.lblDetail[5].setText(this.changeRequest.getString("updated_at"));
        this.lblContent[0].setText(
                "<html><div style='margin:10px;font-size:12px;'><b>Title:</b><br><p style='padding-left:10px;'>"
                        + this.changeRequest.getString("title") + "</p></div></html>");
        this.lblContent[1].setText(
                "<html><div style='margin:10px; font-size:12px;'><b>Details:</b><br><p style='padding-left:10px;'>"
                        + this.changeRequest.getString("details") + "</p></div></html>");
    }

    // top panel consist of home button and status label
    private JPanel getTopPanel() {
        JPanel pane = new JPanel();
        pane.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 0));
        pane.setLayout(new BoxLayout(pane, BoxLayout.X_AXIS));
        pane.setBackground(null);
        JButton btnHome = new JButton(new ImageIcon(app.getDir() + "img/home.png"));
        btnHome.setFont(CRTStyle.getFont());
        // go to home
        btnHome.addActionListener(e -> {
            loader.setActive(false, 0);
            app.toHome();
        });
        lblStatus = new JButton("N/A");
        lblStatus.setPreferredSize(new Dimension(170, 0));
        lblStatus.setFont(CRTStyle.getFont());
        lblStatus.setForeground(Color.WHITE);
        pane.add(btnHome);
        pane.add(Box.createHorizontalGlue());
        pane.add(lblStatus);
        return pane;
    }

    private JPanel getCenterPanel() {
        centerPane = new JPanel(new BorderLayout());
        centerPane.setBackground(null);
        centerPane.add(getDetailPanel(), BorderLayout.NORTH);
        centerPane.add(tabPane(), BorderLayout.CENTER);
        return centerPane;
    }

    // get tab pane
    private JTabbedPane tabPane() {
        CRHistory histPane = new CRHistory(id, loader, app.http());
        JTabbedPane tabbedPane = new JTabbedPane();
        CRMessage msgPane = new CRMessage(id, loader, app.http(), app.getUser().getFullName());
        tabbedPane.setBackground(null);
        tabbedPane.setBorder(BorderFactory.createEmptyBorder(0, 20, 0, 20));
        tabbedPane.addTab("<html><p style='padding:0 33px;'><b>Content</b></p></html>", getContentPanel());
        tabbedPane.addTab("<html><p style='padding:0 33px;'><b>Message</b></p></html>", msgPane);
        tabbedPane.addTab("<html><p style='padding:0 33px;'><b>History</b></p></html>", new JScrollPane(histPane));
        tabbedPane.addChangeListener(e -> {
            switch (tabbedPane.getSelectedIndex()) {
            case 1:
                // stop crhistory worker
                loader.setActive(false, 2);
                msgPane.start();
                break;
            case 2:
                // stop crmessage worker
                loader.setActive(false, 1);
                histPane.start();
                break;
            default:
                // stop all subpanel worker
                loader.setActive(false, 1);
                loader.setActive(false, 2);
            }
        });
        return tabbedPane;
    }

    // display change request detail
    private JPanel getDetailPanel() {
        JPanel parentPane = new JPanel(new BorderLayout());
        parentPane.setBorder(BorderFactory.createEmptyBorder(10, 20, 20, 20));
        parentPane.setBackground(null);
        JPanel pane = new JPanel(new GridLayout(6, 2, 0, 5));

        pane.setBackground(null);
        String[] lblHeader = { "<b>CLient Name</b>", "<b>Request ID</b>", "<b>Messages</b>", "<b>Histories</b>",
                "<b>Post At</b>", "<b>Updated At</b>" };
        for (int i = 0; i < 6; i++) {
            this.lblDetail[i] = myLabel("", JLabel.LEFT);
            pane.add(myLabel(lblHeader[i], JLabel.LEFT));
            pane.add(this.lblDetail[i]);
        }
        parentPane.add(pane, BorderLayout.CENTER);
        parentPane.add(getStatusBar(), BorderLayout.SOUTH);
        return parentPane;
    }

    // status bar
    public JPanel getStatusBar() {
        JPanel pane = new JPanel(new GridLayout(1, 4, 0, 0));
        pane.setBackground(null);
        pane.setBorder(BorderFactory.createEmptyBorder(10, 0, 0, 0));
        String[] lbl = { "Cancelled", "To Do", "In Progress", "Complete" };
        for (int i = 0; i < 4; i++) {
            this.statusBar[i] = new JButton(lbl[i]);
            // add change status event if user is admin
            if (this.app.getUser().isAdmin()) {
                this.statusBar[i].addActionListener(this);
            }
            pane.add(this.statusBar[i]);
        }
        return pane;
    }

    public void setStatusBar(String status, Color statusColor) {
        for (int i = 0; i < 4; i++) {
            if (this.statusBar[i].getText().equals(status)) {
                this.statusBar[i].setBackground(statusColor);
                this.statusBar[i].setForeground(Color.WHITE);
            } else {
                this.statusBar[i].setBackground(null);
                this.statusBar[i].setForeground(Color.LIGHT_GRAY);
            }
        }
    }

    public JLabel myLabel(String txt, int pos) {
        JLabel label = new JLabel("<html><p style='padding:5px; 0'>" + txt + "</p></html>", pos);
        label.setFont(CRTStyle.getCrfont());
        label.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, Color.LIGHT_GRAY));
        return label;
    }

    // status change click event
    @Override
    public void actionPerformed(ActionEvent e) {
        JButton btn = (JButton) e.getSource();
        String newStatus = btn.getText();
        int confirm = JOptionPane.showConfirmDialog(null,
                "Are you sure to change status from " + oldStatus + " to " + newStatus, "Update Status",
                JOptionPane.OK_CANCEL_OPTION);

        if (confirm == 0) {
            Response response = this.app.http().updateStatus(id, newStatus);
            if (response.getStatus() == 200) {
                changeRequest = response.getJson();
                try {
                    setData();
                } catch (JSONException e1) {
                    e1.printStackTrace();
                }
            } else {
                JOptionPane.showMessageDialog(this, "Something is wrong");
            }
        }
    }

    // change request content
    public JScrollPane getContentPanel() {
        JPanel contentPane = new JPanel();
        contentPane.setLayout(new BoxLayout(contentPane, BoxLayout.Y_AXIS));
        contentPane.setBackground(Color.WHITE);
        contentPane.setBorder(BorderFactory.createMatteBorder(0, 2, 0, 2, Color.LIGHT_GRAY));

        // layout magics....
        lblContent = new JLabel[] { new JLabel(), new JLabel() };
        lblContent[0].setBorder(BorderFactory.createMatteBorder(0, 0, 2, 0, Color.LIGHT_GRAY));
        lblContent[0].setMaximumSize(new Dimension(450, 100));
        lblContent[1].setMaximumSize(new Dimension(450, 2000));
        lblContent[0].setVerticalAlignment(JLabel.TOP);
        lblContent[1].setVerticalAlignment(JLabel.TOP);
        contentPane.add(lblContent[0]);
        contentPane.add(lblContent[1]);
        JScrollPane sp = new JScrollPane(contentPane);
        sp.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        return sp;
    }

    // get change request information from cr json
    public Object getCR(String key) {
        try {
            return changeRequest.get(key);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    public App getApp() {
        return this.app;
    }

}