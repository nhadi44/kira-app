"use client";

import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  PDFDownloadLink 
} from '@react-pdf/renderer';
import { AuditFinding } from '@/lib/validations/audit';
import { Download, FileText } from 'lucide-react';

// Register fonts if needed, or use standard ones
// For simplicity, we use standard Helvetica/Courier

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 10,
  },
  headerLeft: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#09090b',
  },
  headerRight: {
    fontSize: 10,
    color: '#71717a',
    textAlign: 'right',
  },
  confidential: {
    fontSize: 8,
    color: '#e11d48',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scoreSection: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreTitle: {
    fontSize: 10,
    color: '#71717a',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#09090b',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#09090b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  finding: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#f4f4f5',
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  findingType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#09090b',
  },
  severity: {
    fontSize: 8,
    padding: '2 6',
    borderRadius: 4,
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 10,
    color: '#3f3f46',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  remediationBlock: {
    backgroundColor: '#18181b',
    padding: 10,
    borderRadius: 4,
  },
  remediationTitle: {
    fontSize: 8,
    color: '#a1a1aa',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  remediationCode: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#10b981',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#a1a1aa',
  }
});

interface PDFReportProps {
  audit: {
    id: string;
    projectName: string;
    score: number;
    createdAt: Date | string;
    findings?: AuditFinding[];
  };
  findings?: AuditFinding[];
}

export const PDFReport = ({ audit, findings: directFindings }: PDFReportProps) => {
  const findings = directFindings || audit.findings || [];
  
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.confidential}>KIRA Confidential</Text>
          <Text style={styles.headerLeft}>Security Audit Report</Text>
        </View>
        <View style={styles.headerRight}>
          <Text>Project: {audit.projectName}</Text>
          <Text>Report ID: {audit.id}</Text>
          <Text>Date: {new Date(audit.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreSection}>
        <View>
          <Text style={styles.scoreTitle}>Integrity Score</Text>
          <Text style={styles.scoreValue}>{audit.score}/100</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.scoreLabel}>
            {audit.score > 80 ? 'SECURE' : audit.score > 50 ? 'WARNING' : 'COMPROMISED'}
          </Text>
        </View>
      </View>

      {/* Findings */}
      <Text style={styles.sectionTitle}>Threat Findings Summary</Text>
      
      {findings.map((finding, i) => (
        <View key={i} style={styles.finding} wrap={false}>
          <View style={styles.findingHeader}>
            <Text style={styles.findingType}>{finding.type}</Text>
            <Text style={[
              styles.severity,
              finding.severity === 'High' ? { backgroundColor: '#fee2e2', color: '#e11d48' } :
              finding.severity === 'Medium' ? { backgroundColor: '#fef3c7', color: '#d97706' } :
              { backgroundColor: '#dcfce7', color: '#166534' }
            ]}>
              {finding.severity}
            </Text>
          </View>
          <Text style={styles.description}>{finding.description}</Text>
          
          <View style={styles.remediationBlock}>
            <Text style={styles.remediationTitle}>Recommended Remediation</Text>
            <Text style={styles.remediationCode}>{finding.remediation}</Text>
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>© 2026 KIRA - Knowledge Integrity & Risk Auditor</Text>
        <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} / ${totalPages}`
        )} />
      </View>
    </Page>
  </Document>
  );
};

export function ExportPDFButton({ audit, findings }: PDFReportProps) {
  return (
    <PDFDownloadLink 
      document={<PDFReport audit={audit} findings={findings} />} 
      fileName={`KIRA-Report-${audit.projectName}-${audit.id.slice(0, 8)}.pdf`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-all hover:bg-zinc-800"
    >
      {({ loading }) => (
        <>
          {loading ? (
            <span className="flex items-center gap-2 animate-pulse">
              <FileText size={16} /> Preparing PDF...
            </span>
          ) : (
            <>
              <Download size={16} /> Export PDF Report
            </>
          )}
        </>
      )}
    </PDFDownloadLink>
  );
}
