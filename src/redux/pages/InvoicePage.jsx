import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../store/api";

const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get("users/profile", { withCredentials: true });
        const userOrders = res.data.orders || [];
        const currentOrder = userOrders.find(
          (o) => o.order_id === parseInt(orderId)
        );
        setOrder(currentOrder);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId]);




  const downloadInvoice = async () => {
  if (!order) return;

  const pdfMakeModule = (await import("pdfmake/build/pdfmake")).default || (await import("pdfmake/build/pdfmake"));
  const pdfFontsModule = (await import("pdfmake/build/vfs_fonts")).default || (await import("pdfmake/build/vfs_fonts"));
  pdfMakeModule.vfs = pdfFontsModule.pdfMake?.vfs || pdfFontsModule.vfs;

  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = total * 0.18; // example 18% GST
  const grandTotal = total + tax;

  const docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          { text: "ShopEase", fontSize: 24, bold: true, color: "#4f46e5" },
          { text: "INVOICE", fontSize: 26, bold: true, alignment: "right" }
        ]
      },
      { text: "\n" },

      // Seller & Customer Info
      {
        columns: [
          {
            stack: [
              { text: "ShopEase Pvt Ltd", bold: true },
              { text: "123 Market Street, Ahmedabad, Gujarat" },
              { text: "Email: support@shopease.com" },
              { text: "Phone: +91 9876543210" }
            ]
          },
          {
            stack: [
              { text: `Bill To: ${order.customer_name || "Customer"}`, bold: true, alignment: "right" },
              { text: order.customer_email || "", alignment: "right" },
              { text: order.shipping_address || "", alignment: "right" }
            ]
          }
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20]
      },

      // Order Details
      {
        columns: [
          { text: `Order ID: ${order.order_id}`, bold: true },
          { text: `Date: ${new Date(order.order_date).toLocaleString()}`, alignment: "right" },
          { text: `Payment Method: ${order.payment_method || "Online"}`, alignment: "right", margin: [0, 0, 0, 0] }
        ],
        margin: [0, 0, 0, 20]
      },

      // Items Table
      {
        table: {
          widths: ["*", "auto", "auto", "auto", "auto"],
          body: [
            [
              { text: "Item", bold: true, fillColor: "#dcdcff" },
              { text: "Description", bold: true, fillColor: "#dcdcff" },
              { text: "Quantity", bold: true, fillColor: "#dcdcff", alignment: "right" },
              { text: "Unit Price", bold: true, fillColor: "#dcdcff", alignment: "right" },
              { text: "Total", bold: true, fillColor: "#dcdcff", alignment: "right" }
            ],
            ...order.items.map(i => [
              i.product_name,
              i.description || "-",
              { text: i.quantity.toString(), alignment: "right" },
              { text: `₹${i.price}`, alignment: "right" },
              { text: `₹${i.price * i.quantity}`, alignment: "right" }
            ]),
            [
              { text: "Subtotal", colSpan: 4, alignment: "right", bold: true }, {}, {}, {},
              { text: `₹${total}`, alignment: "right", bold: true }
            ],
            [
              { text: "GST (18%)", colSpan: 4, alignment: "right", bold: true }, {}, {}, {},
              { text: `₹${tax.toFixed(2)}`, alignment: "right", bold: true }
            ],
            [
              { text: "Grand Total", colSpan: 4, alignment: "right", bold: true }, {}, {}, {},
              { text: `₹${grandTotal.toFixed(2)}`, alignment: "right", bold: true, fillColor: "#dcdcff" }
            ]
          ]
        },
        layout: {
          fillColor: (rowIndex) => rowIndex % 2 === 0 ? "#f5f5f5" : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#dcdcff",
          vLineColor: () => "#dcdcff"
        },
        margin: [0, 0, 0, 20]
      },

      // Footer
      { text: "Thank you for shopping with ShopEase!", alignment: "center", italics: true, color: "#4f46e5" },
      { text: "Visit us at: www.shopease.com", alignment: "center", italics: true, color: "#4f46e5" }
    ],
    defaultStyle: { fontSize: 12 }
  };

  pdfMakeModule.createPdf(docDefinition).download(`invoice_${orderId}.pdf`);
};



  if (!order) return <p>Loading invoice...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Invoice</h1>
        <p>
          <strong>Order ID:</strong> {order.order_id}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.order_date).toLocaleString()}
        </p>
        <hr className="my-2" />
        <h2 className="font-semibold mt-2">Items:</h2>
        <ul className="mt-2">
          {order.items.map((item) => (
            <li key={item.product_id} className="flex justify-between my-1">
              <span>
                {item.product_name} (x{item.quantity})
              </span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <hr className="my-2" />
        <p className="font-semibold text-right">
          Total: ₹{order.items.reduce((acc, i) => acc + i.price * i.quantity, 0)}
        </p>
      </div>

      <button
        onClick={downloadInvoice}
        className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default InvoicePage;
