package panel.nested.home;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumn;
import javax.swing.table.TableModel;
import javax.swing.table.TableRowSorter;
import javax.swing.RowFilter;

import main.App;
import tool.CRTStyle;

/**
 * CRTable
 */
public class CRTable extends JPanel {

    private static final long serialVersionUID = 1L;
    private String[] columns;
    private JTable table;
    private TableRowSorter<TableModel> sorter;
    private App app;
    private static final Font tableFont = new Font("SansSerif", Font.PLAIN, 14);
    private boolean loading = false;
    private JComboBox<String> filter;

    public CRTable(App app) {
        this.app = app;
        this.setBackground(Color.WHITE);
        this.setLayout(new BorderLayout());
        this.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 0));
        // no client name if user is not admin
        this.columns = app.getUser().isAdmin() ? new String[] { "ID", "Client Name", "Status", "Created At" }
                : new String[] { "ID", "Status", "Created At" };
        setupTable();
        this.add(tableSearch(), BorderLayout.NORTH);
        this.add(new JScrollPane(table), BorderLayout.CENTER);
        loadData();
    }

    // setup table
    private void setupTable() {
        table = new JTable() {
            private static final long serialVersionUID = 1L;

            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }

            @Override
            public Component prepareRenderer(TableCellRenderer renderer, int row, int column) {
                Component component = super.prepareRenderer(renderer, row, column);
                int rendererWidth = component.getPreferredSize().width;
                TableColumn tableColumn = getColumnModel().getColumn(column);
                tableColumn.setPreferredWidth(
                        Math.max(rendererWidth + getIntercellSpacing().width, tableColumn.getPreferredWidth()));
                return component;
            }
        };
        table.getTableHeader().setReorderingAllowed(false);
        table.setRowHeight(25);
        table.setFont(tableFont);
        table.addMouseListener(new MouseAdapter() { // listen to the click
            public void mouseClicked(MouseEvent evt) {
                // open selected row after double click
                if (evt.getClickCount() == 2) {
                    int row = table.rowAtPoint(evt.getPoint());
                    app.toChangeRequest((int) table.getValueAt(row, 0));
                }
            }
        });

    }

    // load data into the table
    public void loadData() {
        this.loading = true;
        Thread worker = new Thread(() -> {
            // http request
            Object[][] data = app.http().getCRList((String) filter.getSelectedItem(), app.getUser().isAdmin());
            TableModel model = new DefaultTableModel(data, columns);
            table.setModel(model);
            sorter = new TableRowSorter<TableModel>(table.getModel());
            table.setRowSorter(sorter);
            this.loading = false;
        });
        worker.start();
    }

    // table button group
    public JPanel getTableBtnGroup() {
        JPanel subBtnPane = new JPanel();
        subBtnPane.setBackground(Color.WHITE);
        // add refresh button
        JButton btnRefresh = new JButton(new ImageIcon(app.getDir() + "img/refresh.png"));
        btnRefresh.addActionListener(e -> {
            if (!loading) {
                loadData();
            }
        });
        ;
        JButton btnView = new JButton("View");
        btnView.setBackground(CRTStyle.getBlue());
        btnView.setForeground(Color.WHITE);
        btnView.addActionListener(e -> {
            // open selected row
            int row = table.getSelectedRow();
            if (row >= 0) {
                app.toChangeRequest((int) table.getValueAt(row, 0));
            }

        });

        filter = new JComboBox<String>(
                new String[] { "Active", "All", "Cancelled", "To Do", "In Progress", "Complete" });
        filter.addActionListener(e -> {
            if (!loading) {
                loadData();
            }
        });
        subBtnPane.add(btnView);
        subBtnPane.add(btnRefresh);
        subBtnPane.add(filter);

        return subBtnPane;
    }

    // enable table search
    public JPanel tableSearch() {
        JPanel pane = new JPanel(new BorderLayout());
        pane.setBackground(Color.WHITE);

        pane.add(getTableBtnGroup(), BorderLayout.WEST);

        JPanel subPane = new JPanel();
        subPane.setBackground(Color.white);
        JTextField search = new JTextField(15);

        // add search event
        search.getDocument().addDocumentListener(new DocumentListener() {

            @Override
            public void insertUpdate(DocumentEvent e) {
                if (!loading) {
                    String text = search.getText();

                    if (text.trim().length() == 0) {
                        sorter.setRowFilter(null);
                    } else {
                        sorter.setRowFilter(RowFilter.regexFilter("(?i)" + text));
                    }
                }
            }

            @Override
            public void removeUpdate(DocumentEvent e) {
                if (!loading) {
                    String text = search.getText();
                    if (text.trim().length() == 0) {
                        sorter.setRowFilter(null);
                    } else {
                        sorter.setRowFilter(RowFilter.regexFilter("(?i)" + text));
                    }
                }
            }

            @Override
            public void changedUpdate(DocumentEvent e) {
                throw new UnsupportedOperationException("Not supported yet.");
            }
        });

        search.setFont(tableFont);
        JLabel lblSearch = new JLabel("Search: ");
        lblSearch.setFont(tableFont);
        subPane.add(lblSearch);
        subPane.add(search);
        pane.add(subPane, BorderLayout.EAST);
        return pane;
    }
}