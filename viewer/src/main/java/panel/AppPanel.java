package panel;

import javax.swing.JPanel;
import main.App;

/**
 * AppPanel
 */
abstract class AppPanel extends JPanel {

    private static final long serialVersionUID = 1L;
    protected App app = null;

    protected AppPanel(App app) {
        this.app = app;
    }
}