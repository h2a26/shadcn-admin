import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProposal } from "../context/proposal-context";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Download } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function ProposalViewDialog() {
  const { open, setOpen, currentProposal } = useProposal();
  const navigate = useNavigate();

  if (!currentProposal) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  // Handle resume
  const handleResume = () => {
    setOpen(null);
    navigate({ to: '/proposal' });
  };

  return (
    <Dialog open={open === 'view'} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Proposal Details</span>
            <Badge variant="outline">{currentProposal.status.toUpperCase()}</Badge>
          </DialogTitle>
          <DialogDescription>
            Created on {formatDate(currentProposal.createdAt)}
            {currentProposal.updatedAt && ` • Updated on ${formatDate(currentProposal.updatedAt)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Proposal Number */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold">Proposal Number:</span>
            <span>{currentProposal.premiumCalculation.proposalNo || 'Not Generated'}</span>
          </div>

          {/* Policyholder Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Policyholder Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p>{currentProposal.policyholderInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p>{currentProposal.policyholderInfo.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{currentProposal.policyholderInfo.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NRC Number</p>
                <p>{currentProposal.policyholderInfo.nrcNumber}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{currentProposal.policyholderInfo.address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Parcel Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Parcel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{currentProposal.parcelDetails.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{currentProposal.parcelDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Declared Value</p>
                <p>{formatCurrency(currentProposal.parcelDetails.declaredValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p>{currentProposal.parcelDetails.weightKg ? `${currentProposal.parcelDetails.weightKg} kg` : 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p>
                  {currentProposal.parcelDetails.lengthCm && currentProposal.parcelDetails.widthCm && currentProposal.parcelDetails.heightCm
                    ? `${currentProposal.parcelDetails.lengthCm} × ${currentProposal.parcelDetails.widthCm} × ${currentProposal.parcelDetails.heightCm} cm`
                    : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Special Conditions</p>
                <p>
                  {[
                    currentProposal.parcelDetails.fragileItem ? 'Fragile' : null,
                    currentProposal.parcelDetails.highRiskItem ? 'High Risk' : null
                  ].filter(Boolean).join(', ') || 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping & Coverage */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Shipping & Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p>{currentProposal.shippingCoverage.origin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p>{currentProposal.shippingCoverage.destination}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipping Date</p>
                <p>{format(new Date(currentProposal.shippingCoverage.shippingDate), 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Date</p>
                <p>{format(new Date(currentProposal.shippingCoverage.deliveryDate), 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coverage Type</p>
                <p>{currentProposal.shippingCoverage.coverageType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deductible</p>
                <p>{currentProposal.shippingCoverage.deductible ? formatCurrency(currentProposal.shippingCoverage.deductible) : 'None'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Additional Riders</p>
                <p>{currentProposal.shippingCoverage.riders?.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Premium Calculation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Premium Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Base Premium</p>
                <p>{formatCurrency(currentProposal.premiumCalculation.basePremium)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Load</p>
                <p>{formatCurrency(currentProposal.premiumCalculation.riskLoad)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discount Code</p>
                <p>{currentProposal.premiumCalculation.discountCode || 'None'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Total Premium</p>
                <p className="font-bold">{formatCurrency(currentProposal.premiumCalculation.totalPremium)}</p>
              </div>
            </div>
          </div>

          {/* Documents & Consent */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Documents & Consent</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Uploaded Documents</p>
                <ul className="list-disc list-inside">
                  {currentProposal.documentsConsent.identityDoc && <li>Identity Document</li>}
                  {currentProposal.documentsConsent.ownershipProof && <li>Ownership Proof</li>}
                  {currentProposal.documentsConsent.invoice && <li>Invoice</li>}
                  {!currentProposal.documentsConsent.identityDoc && 
                   !currentProposal.documentsConsent.ownershipProof && 
                   !currentProposal.documentsConsent.invoice && <li>No documents uploaded</li>}
                </ul>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consent</p>
                <ul className="list-disc list-inside">
                  <li>
                    {currentProposal.documentsConsent.agreeTerms 
                      ? 'Agreed to terms and conditions' 
                      : 'Has not agreed to terms and conditions'}
                  </li>
                  <li>
                    {currentProposal.documentsConsent.confirmAccuracy 
                      ? 'Confirmed accuracy of information' 
                      : 'Has not confirmed accuracy of information'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(null)}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          {currentProposal.status === 'draft' && (
            <Button onClick={handleResume}>
              <Pencil className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
