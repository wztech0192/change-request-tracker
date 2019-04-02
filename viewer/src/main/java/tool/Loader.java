package tool;

/**
 * Loader
 */
public class Loader {

    private Boolean[] active;

    public Loader(int num) {
        active = new Boolean[num];
    }

    public void setActive(Boolean active, int i) {
        this.active[i] = active;
    }

    public Boolean isActive(int i) {
        return this.active[i];
    }
}