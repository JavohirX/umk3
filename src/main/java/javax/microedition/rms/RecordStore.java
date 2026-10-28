package javax.microedition.rms;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Desktop compatibility implementation of RecordStore.
 * Persists records to disk under a local .rms/ folder.
 */
public class RecordStore {
    private static final File STORAGE_DIR = new File(".rms");
    private final String recordStoreName;
    private final List<byte[]> records = new ArrayList<>();

    private RecordStore(String name) {
        this.recordStoreName = name;
        loadRecords();
    }

    public static synchronized RecordStore openRecordStore(String recordStoreName, boolean createIfNecessary) {
        if (!STORAGE_DIR.exists()) {
            STORAGE_DIR.mkdirs();
        }
        return new RecordStore(recordStoreName);
    }

    public int getNumRecords() {
        return records.size();
    }

    public synchronized int addRecord(byte[] data, int offset, int numBytes) {
        byte[] copy = null;
        if (data != null && numBytes >= 0) {
            copy = new byte[numBytes];
            System.arraycopy(data, offset, copy, 0, numBytes);
        }
        records.add(copy);
        saveRecords();
        return records.size();
    }

    public synchronized byte[] getRecord(int recordId) {
        int idx = recordId - 1;
        if (idx < 0 || idx >= records.size()) {
            return null;
        }
        byte[] rec = records.get(idx);
        if (rec == null) return null;
        byte[] copy = new byte[rec.length];
        System.arraycopy(rec, 0, copy, 0, rec.length);
        return copy;
    }

    public synchronized void setRecord(int recordId, byte[] newData, int offset, int numBytes) {
        int idx = recordId - 1;
        while (records.size() <= idx) {
            records.add(null);
        }
        byte[] copy = null;
        if (newData != null && numBytes >= 0) {
            copy = new byte[numBytes];
            System.arraycopy(newData, offset, copy, 0, numBytes);
        }
        records.set(idx, copy);
        saveRecords();
    }

    public void closeRecordStore() {
        saveRecords();
    }

    private void loadRecords() {
        File file = new File(STORAGE_DIR, recordStoreName + ".bin");
        if (!file.exists()) return;
        try (InputStream is = new FileInputStream(file)) {
            records.clear();
            int count = (is.read() << 8) | is.read();
            for (int i = 0; i < count; i++) {
                int lenHigh = is.read();
                int lenLow = is.read();
                if (lenHigh == -1 || lenLow == -1) break;
                int len = (lenHigh << 8) | lenLow;
                if (len == 0xFFFF) {
                    records.add(null);
                } else {
                    byte[] data = new byte[len];
                    int read = 0;
                    while (read < len) {
                        int r = is.read(data, read, len - read);
                        if (r <= 0) break;
                        read += r;
                    }
                    records.add(data);
                }
            }
        } catch (Exception ignored) {
        }
    }

    private void saveRecords() {
        File file = new File(STORAGE_DIR, recordStoreName + ".bin");
        try (OutputStream os = new FileOutputStream(file)) {
            int count = records.size();
            os.write((count >> 8) & 0xFF);
            os.write(count & 0xFF);
            for (byte[] rec : records) {
                if (rec == null) {
                    os.write(0xFF);
                    os.write(0xFF);
                } else {
                    os.write((rec.length >> 8) & 0xFF);
                    os.write(rec.length & 0xFF);
                    os.write(rec);
                }
            }
            os.flush();
        } catch (Exception ignored) {
        }
    }
}
