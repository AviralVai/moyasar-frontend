import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from "jspdf";

const ConfirmPayment = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Confirming your payment...');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const confirm = async () => {
      const invoiceId = searchParams.get('invoice_id');
      const paymentStatus = searchParams.get('status');

      if (!invoiceId) {
        setStatus('❌ Missing invoice ID.');
        return;
      }

      if (paymentStatus !== 'paid') {
        setStatus(`❌ Payment status is '${paymentStatus}'.`);
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7165/api/payment/confirm?id=${invoiceId}`);
        console.log('Payment confirmation response:', response);
        setStatus(response.data.status || '✅ Payment confirmed successfully.');
        setIsConfirmed(true);

        if (response.data?.Url) {
          setTimeout(() => {
            window.open(response.data.Url.replace, "_blank");
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus(err.response?.data || '❌ Failed to confirm payment.');
      }
    };

    confirm();
  }, [searchParams]);

  // Once confirmed, fetch the invoice data
  useEffect(() => {
    const fetchInvoiceData = async () => {
      const invoiceId = searchParams.get('invoice_id');
      if (!invoiceId) return;
      try {
        const resp = await fetch(`https://localhost:7165/api/payment/invoice/data/${invoiceId}`);
        if (!resp.ok) throw new Error("Could not fetch invoice data");
        const data = await resp.json();
        console.log("Invoice JSON data:", data); // ADD THIS
        setInvoiceData(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (isConfirmed && !invoiceData) {
      fetchInvoiceData();
      console.log("Fetched invoice data:", fetchInvoiceData);

    }
  }, [isConfirmed, invoiceData, searchParams]);

  // Updated handleDownloadInvoice function for a beautiful PDF invoice UI
  const handleDownloadInvoice = async () => {
    const invoiceId = searchParams.get('invoice_id');
    if (!invoiceId) {
        alert('Missing invoice ID.');
        console.log("invoiceData:", invoiceData);
        return;
    }

    try {
        // Fetch invoice data (if not already loaded)
        const resp = await fetch(`https://localhost:7165/api/payment/invoice/data/${invoiceId}`);
        if (!resp.ok) throw new Error("Could not fetch invoice data");
        const { invoice, subscription } = await resp.json();

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header Background
        doc.setFillColor(29, 161, 242); // Blue color
        doc.rect(0, 0, pageWidth, 60, 'F');

        // Header Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Subscription Invoice", pageWidth / 2, 35, { align: "center" });

        // Separator line below header
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(10, 65, pageWidth - 10, 65);

        // Invoice Section Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(29, 161, 242);
        doc.text("Invoice Details", 20, 80);

        // Invoice details background box
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(15, 85, pageWidth - 30, 70, 3, 3, 'F');

        // Invoice details content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        let startY = 95;
        const lineSpacing = 8;
        
        doc.text(`Subscription ID: ${subscription.subscriptionId}`, 20, startY);
        startY += lineSpacing;
        doc.text(`Customer ID: ${subscription.customerId}`, 20, startY);
        startY += lineSpacing;
        doc.text(`Customer: ${subscription.name}`, 20, startY);
        startY += lineSpacing;
        doc.text(`Email: ${subscription.email}`, 20, startY);
        startY += lineSpacing;
        doc.text(`Phone: ${subscription.phone}`, 20, startY);
        startY += lineSpacing;
        doc.text(
            `Period: ${new Date(subscription.startDate).toLocaleDateString()} - ${new Date(subscription.endDate).toLocaleDateString()}`,
            20,
            startY
        );
        startY += lineSpacing;
        doc.text(`Status: ${subscription.status}`, 20, startY);

        // Payment details section
        let infoStartY = 170;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(29, 161, 242);
        doc.text("Payment Details", 20, infoStartY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        infoStartY += 10;
        doc.text(`Amount Paid: ${(invoice.amount / 100).toFixed(2)} ${invoice.currency}`, 20, infoStartY);
        infoStartY += lineSpacing;
        
        // Moyasar URL with text wrapping and custom link color
        doc.text("Moyasar URL:", 20, infoStartY);
        doc.setTextColor(0, 102, 204);  // Different color for URL
        const urlLines = doc.splitTextToSize(invoice.url, pageWidth - 40);
        doc.text(urlLines, 20, infoStartY + lineSpacing);
        infoStartY += lineSpacing + (urlLines.length * lineSpacing);
        doc.setTextColor(50, 50, 50);
        
        doc.text(`Invoice ID: ${invoiceId}`, 20, infoStartY);
        infoStartY += lineSpacing * 2;
        doc.text("Thank you for your subscription!", 20, infoStartY);

        // Footer with thank you note
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("We appreciate your business.", pageWidth / 2, pageHeight - 20, { align: "center" });

        // Save the document
        doc.save(`subscription_${subscription.subscriptionId}.pdf`);
    } catch (err) {
        console.error(err);
        alert('Failed to download invoice as PDF.');
    }
  };

  // Container and card styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #80F665 0%, #85F1FD 100%)',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px 50px',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    border: '3px solid #fda085',
    marginBottom: '20px'
  };

  const headingStyle = {
    fontSize: '26px',
    marginBottom: '16px',
    color: status.includes('❌') ? '#e63946' : '#2a9d8f',
    fontWeight: '600',
  };

  const subHeadingStyle = {
    fontSize: '16px',
    color: '#555',
    marginTop: '10px',
    marginBottom: '20px',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#333',
    marginRight: '5px'
  };

  const invoiceItemStyle = {
    margin: '8px 0'
  };

  const buttonStyle = {
    backgroundColor: '#fda085',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: '0.3s ease',
    marginTop: '20px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>{status}</h2>
        <p style={subHeadingStyle}>
          Thank you for your patience. Please wait while we process your payment confirmation.
        </p>
        {isConfirmed && invoiceData && (
          <>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <h3 style={{ color: '#2a9d8f', marginBottom: '10px', textAlign: 'center' }}>Subscription Invoice</h3>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Subscription ID:</span>
                <span>{invoiceData.subscription.subscriptionId}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Customer ID:</span>
                <span>{invoiceData.subscription.customerId}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Customer:</span>
                <span>{invoiceData.subscription.name}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Email:</span>
                <span>{invoiceData.subscription.email}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Phone:</span>
                <span>{invoiceData.subscription.phone}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Period:</span>
                <span>
                  {new Date(invoiceData.subscription.startDate).toLocaleDateString()} – {new Date(invoiceData.subscription.endDate).toLocaleDateString()}
                </span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Status:</span>
                <span>{invoiceData.subscription.status}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Amount:</span>
                <span>{(invoiceData.invoice.amount / 100).toFixed(2)} {invoiceData.invoice.currency}</span>
              </div>
              <div style={invoiceItemStyle}>
                <span style={labelStyle}>Moyasar URL:</span>
                <a href={invoiceData.invoice.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2a9d8f' }}>
                  {invoiceData.invoice.url}
                </a>
              </div>
            </div>
            <button style={buttonStyle} onClick={handleDownloadInvoice}>
              Download Invoice (PDF)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmPayment;
