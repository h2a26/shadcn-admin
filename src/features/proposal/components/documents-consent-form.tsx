import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFormContext } from "react-hook-form";
import { DocumentsConsent } from "../types";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function DocumentsConsentForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<{ documentsConsent: DocumentsConsent }>();

  const [identityDocName, setIdentityDocName] = useState<string>("");
  const [ownershipProofName, setOwnershipProofName] = useState<string>("");
  const [invoiceName, setInvoiceName] = useState<string>("");

  return (
    <div className="space-y-6 text-start">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Required Documents</h3>
        <p className="text-sm text-muted-foreground">
          Please upload the following required documents to complete your proposal.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Identity Document
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="documentsConsent.identityDoc"
                control={control}
                defaultValue={null}
                render={({ field: { value, onChange, ...field } }) => (
                  <>
                    <Input
                      {...field}
                      id="identityDoc"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setIdentityDocName(file.name);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("identityDoc")?.click()}
                    >
                      Choose File
                    </Button>
                    <span className="text-sm">
                      {identityDocName || "No file chosen"}
                    </span>
                  </>
                )}
              />
            </div>
            {errors.documentsConsent?.identityDoc && (
              <span className="text-sm text-destructive">
                {errors.documentsConsent.identityDoc.message}
              </span>
            )}
            <p className="text-xs text-muted-foreground">
              Upload a valid government-issued ID (passport, driver's license, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Ownership Proof
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="documentsConsent.ownershipProof"
                control={control}
                defaultValue={null}
                render={({ field: { value, onChange, ...field } }) => (
                  <>
                    <Input
                      {...field}
                      id="ownershipProof"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setOwnershipProofName(file.name);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("ownershipProof")?.click()}
                    >
                      Choose File
                    </Button>
                    <span className="text-sm">
                      {ownershipProofName || "No file chosen"}
                    </span>
                  </>
                )}
              />
            </div>
            {errors.documentsConsent?.ownershipProof && (
              <span className="text-sm text-destructive">
                {errors.documentsConsent.ownershipProof.message}
              </span>
            )}
            <p className="text-xs text-muted-foreground">
              Upload proof of ownership for the parcel contents (receipt, certificate, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Invoice (Optional)
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="documentsConsent.invoice"
                control={control}
                defaultValue={null}
                render={({ field: { value, onChange, ...field } }) => (
                  <>
                    <Input
                      {...field}
                      id="invoice"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setInvoiceName(file.name);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("invoice")?.click()}
                    >
                      Choose File
                    </Button>
                    <span className="text-sm">
                      {invoiceName || "No file chosen"}
                    </span>
                  </>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload an invoice or receipt if available
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Terms and Conditions</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Controller
              name="documentsConsent.agreeTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="agreeTerms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            <div className="space-y-1">
              <label
                htmlFor="agreeTerms"
                className="text-sm font-medium leading-none"
              >
                I agree to the terms and conditions
              </label>
              <p className="text-xs text-muted-foreground">
                By checking this box, you agree to the insurance policy terms, coverage limits, 
                exclusions, and claims process as outlined in our terms and conditions.
              </p>
              {errors.documentsConsent?.agreeTerms && (
                <span className="text-sm text-destructive">
                  {errors.documentsConsent.agreeTerms.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Controller
              name="documentsConsent.confirmAccuracy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="confirmAccuracy"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            <div className="space-y-1">
              <label
                htmlFor="confirmAccuracy"
                className="text-sm font-medium leading-none"
              >
                I confirm the accuracy of the information provided
              </label>
              <p className="text-xs text-muted-foreground">
                I confirm that all information provided in this proposal is accurate and complete. 
                I understand that providing false information may result in claim denial or policy cancellation.
              </p>
              {errors.documentsConsent?.confirmAccuracy && (
                <span className="text-sm text-destructive">
                  {errors.documentsConsent.confirmAccuracy.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
