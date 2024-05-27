public class SalesRecord {
    private String product;
    private int quantity;
    private double price;
    private String date;

    public SalesRecord(String product, int quantity, double price, String date) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.date = date;
    }

    // Getters and Setters
    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}

public class SalesAnalysis {
    private List<SalesRecord> salesRecords;

    public SalesAnalysis() {
        this.salesRecords = new ArrayList<>();
    }

    public void addSalesRecord(SalesRecord record) {
        salesRecords.add(record);
    }

    public double calculateTotalSales() {
        double totalSales = 0;
        for (SalesRecord record : salesRecords) {
            totalSales += record.getQuantity() * record.getPrice();
        }
        return totalSales;
    }

    public SalesRecord getTopSellingProduct() {
        SalesRecord topProduct = null;
        int maxQuantity = 0;
        for (SalesRecord record : salesRecords) {
            if (record.getQuantity() > maxQuantity) {
                maxQuantity = record.getQuantity();
                topProduct = record;
            }
        }
        return topProduct;
    }

    public double calculateAverageSales() {
        if (salesRecords.isEmpty()) {
            return 0;
        }
        return calculateTotalSales() / salesRecords.size();
    }

    
}
public class Main {
    public static void main(String[] args) {
        SalesAnalysis salesAnalysis = new SalesAnalysis();

        
        salesAnalysis.addSalesRecord(new SalesRecord("Product A", 10, 15.5, "2023-05-20"));
        salesAnalysis.addSalesRecord(new SalesRecord("Product B", 5, 10.0, "2023-05-21"));
        salesAnalysis.addSalesRecord(new SalesRecord("Product C", 20, 5.0, "2023-05-22"));

        
        System.out.println("Total Sales: $" + salesAnalysis.calculateTotalSales());
        SalesRecord topProduct = salesAnalysis.getTopSellingProduct();
        System.out.println("Top Selling Product: " + topProduct.getProduct() + " with " + topProduct.getQuantity() + " units sold.");
        System.out.println("Average Sales: $" + salesAnalysis.calculateAverageSales());
    }
}
