import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  X,
  GripVertical,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useClinicStore from "../store/useClinicStore";
import { useToast } from "../components/shared/Toast";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { clinicGeneralSchema, clinicContactSchema } from "../lib/validators";
import { cn } from "../lib/utils";
import { summarizeCoverage, getNextOverride } from "../lib/workingHours";
import useAuthStore from "../store/useAuthStore";
import { IKContext, IKUpload } from "imagekitio-react";
import { tenantApi } from "../lib/api"; // Ensure this is imported for the authenticator

// ─── Skeleton Components ──────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

function SkeletonGeneralInfo() {
  return (
    <div className="bg-surface border border-border rounded-md p-6 space-y-5">
      <SkeletonBlock className="h-5 w-32" />
      <div>
        <SkeletonBlock className="h-2.5 w-20 mb-2" />
        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-16 h-16 rounded-md" />
          <div className="space-y-2">
            <SkeletonBlock className="h-3.5 w-24" />
            <SkeletonBlock className="h-2.5 w-40" />
          </div>
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <SkeletonBlock className="h-2.5 w-24" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      ))}
      <div className="space-y-1.5">
        <SkeletonBlock className="h-2.5 w-28" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
      <div className="flex justify-end">
        <SkeletonBlock className="h-9 w-28" />
      </div>
    </div>
  );
}

function SkeletonWorkingHours() {
  return (
    <div className="bg-surface border border-border rounded-md p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-2.5 w-64" />
        </div>
        <SkeletonBlock className="h-8 w-28" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-md p-4 bg-surface-secondary space-y-2">
            <SkeletonBlock className="h-2.5 w-16" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="h-9 w-48" />
    </div>
  );
}

function SkeletonServices() {
  return (
    <div className="bg-surface border border-border rounded-md p-6 space-y-4">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-24" />
        <SkeletonBlock className="h-2.5 w-72" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
      <div className="space-y-1.5">
        <SkeletonBlock className="h-2.5 w-28" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 flex-1" />
          <SkeletonBlock className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

function SkeletonContactLocation() {
  return (
    <div className="bg-surface border border-border rounded-md p-6 space-y-4">
      <SkeletonBlock className="h-5 w-40" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonBlock className="h-2.5 w-24" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
        ))}
        <div className="col-span-2 space-y-1.5">
          <SkeletonBlock className="h-2.5 w-24" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <SkeletonBlock className="h-9 w-32" />
      </div>
    </div>
  );
}

function SkeletonDangerZone() {
  return (
    <div className="border-2 border-danger/30 rounded-md p-6 space-y-4 bg-danger-light/30">
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBlock className="h-[18px] w-[18px] rounded-full" />
        <SkeletonBlock className="h-5 w-28" />
      </div>
      <SkeletonBlock className="h-3.5 w-72" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-surface border border-danger/20 rounded-md">
          <div className="space-y-1.5">
            <SkeletonBlock className="h-3.5 w-32" />
            <SkeletonBlock className="h-2.5 w-48" />
          </div>
          <SkeletonBlock className="h-9 w-28" />
        </div>
      ))}
      <div className="p-4 bg-surface border border-border rounded-md space-y-3">
        <SkeletonBlock className="h-3.5 w-32" />
        <SkeletonBlock className="h-2.5 w-64" />
        <SkeletonBlock className="h-8 w-28" />
      </div>
    </div>
  );
}

const LEFT_NAV = [
  "General Info",
  "Working Hours",
  "Services",
  "Contact & Location",
  "Danger Zone",
];

// ─── Service Tag (draggable) ──────────────────────────────────────────────────

function ServiceTag({ service, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-secondary border border-border rounded-md text-sm text-text-primary cursor-grab"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={13} className="text-text-muted" />
      {service}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(service);
        }}
        className="text-text-muted hover:text-danger transition-colors ml-1"
        aria-label={`Remove ${service}`}
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Clinic Settings Page ─────────────────────────────────────────────────────

export default function ClinicSettings() {
  const {
    clinic,
    workingHours,
    services,
    updateClinic,
    addService,
    removeService,
    reorderServices,
    resetFaqs,
    updateProfileOnApi,
    loadProfileFromApi,
  } = useClinicStore();
  const { user } = useAuthStore();

  const toast = useToast();

  const [section, setSection] = useState("General Info");
  const [newService, setNewService] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // 1. Initialize preview with the existing logo if they have one
  const [logoPreview, setLogoPreview] = useState(clinic.logo || null);
  // 2. Add a loading state just for the image upload
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLogoPreview(clinic.logo || null);
  }, [clinic.logo]);
  const fileRef = useRef(null);

  // Helper to check if logo has changed from current clinic logo in store
  // const logoHasChanged = logoPreview !== clinic.logo;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await loadProfileFromApi();
      } catch (error) {
        console.error("Failed to load clinic profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [loadProfileFromApi]);
  // 3. Add the Authenticator function required by ImageKit
  const authenticator = async () => {
    try {
      const response = await tenantApi.getImageKitAuth();



      // If your backend returns the keys directly:
      if (response.token && response.signature && response.expire) {
        return response;
      }

      // If your backend nests the keys under a 'data' property (very common):
      if (response.data && response.data.token) {
        return response.data;
      }

      // If neither worked, throw a clear error so we know what to fix
      throw new Error(
        "Could not find token, signature, and expire in response",
      );
    } catch (error) {
      console.error("Auth Error:", error);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const generalForm = useForm({
    resolver: zodResolver(clinicGeneralSchema),
    defaultValues: {
      name: clinic.name,
      description: clinic.description,
      website: clinic.website,
    },
  });

  const contactForm = useForm({
    resolver: zodResolver(clinicContactSchema),
    defaultValues: {
      address: clinic.address,
      city: clinic.city,
      postalCode: clinic.postalCode,
      phone: clinic.phone,
      email: clinic.email,
    },
  });

  const saveGeneral = async (data) => {
    setSaving(true);
    try {
      await updateProfileOnApi({
        ...clinic,
        name: data.name,
        description: data.description,
        website: data.website,
        logo: logoPreview, // Save the new logo preview URL to the clinic profile
      });
      toast.success("Clinic info saved!");
      generalForm.reset(data);
    } catch (error) {
      console.error("Error saving general info:", error);
      toast.error("Failed to save clinic info. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async (data) => {
    setSaving(true);
    try {
      await updateProfileOnApi({
        ...clinic,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        phone: data.phone,
        email: data.email,
      });
      toast.success("Contact info saved!");
      contactForm.reset(data);
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast.error("Failed to save contact info. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = (e) => {
    if (e.key === "Enter" && newService.trim()) {
      handleAddServiceWithSave();
    }
  };

  const handleAddServiceWithSave = async () => {
    if (!newService.trim()) return;
    setSaving(true);
    try {
      const updatedServices = [...services, newService.trim()];
      addService(newService.trim());
      await updateProfileOnApi({
        ...clinic,
        services: updatedServices,
      });
      setNewService("");
      toast.success("Service added!");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveServiceWithSave = async (service) => {
    setSaving(true);
    try {
      const updatedServices = services.filter((s) => s !== service);
      removeService(service);
      await updateProfileOnApi({
        ...clinic,
        services: updatedServices,
      });
      toast.success("Service removed!");
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error("Failed to remove service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleServiceDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = services.indexOf(active.id);
      const newIdx = services.indexOf(over.id);
      const reorderedServices = arrayMove(services, oldIdx, newIdx);
      reorderServices(reorderedServices);
      setSaving(true);
      try {
        await updateProfileOnApi({
          ...clinic,
          services: reorderedServices,
        });
        toast.success("Services reordered!");
      } catch (error) {
        console.error("Error reordering services:", error);
        toast.error("Failed to reorder services. Please try again.");
      } finally {
        setSaving(false);
      }
    }
  };

  const coverage = summarizeCoverage(workingHours);
  const nextOverride = getNextOverride(workingHours);

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-h2 text-text-primary mb-6">Clinic Settings</h1>

      <div className="flex gap-6">
        {/* ── Left Nav ──────────────────────────────────────────── */}
        <nav className="w-48 flex-shrink-0 space-y-0.5">
          {LEFT_NAV.map((item) => (
            <button
              key={item}
              onClick={() => setSection(item)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                section === item
                  ? "bg-primary-light text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
                item === "Danger Zone" &&
                  section !== "Danger Zone" &&
                  "text-danger hover:bg-danger-light",
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* ── Right Content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isLoading ? (
                <>
                  {section === "General Info" && <SkeletonGeneralInfo />}
                  {section === "Working Hours" && <SkeletonWorkingHours />}
                  {section === "Services" && <SkeletonServices />}
                  {section === "Contact & Location" && <SkeletonContactLocation />}
                  {section === "Danger Zone" && <SkeletonDangerZone />}
                </>
              ) : (
                <>
                  {/* General Info */}
                  {section === "General Info" && (
                <form
                  onSubmit={generalForm.handleSubmit(saveGeneral)}
                  className="bg-surface border border-border rounded-md p-6 space-y-5"
                >
                  <h2 className="text-h4 text-text-primary mb-1">
                    General Info
                  </h2>

                  {/* Logo upload */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-2">
                      Clinic Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-surface-secondary relative">
                        {isUploadingLogo ? (
                          <Loader2
                            size={20}
                            className="text-primary animate-spin"
                          />
                        ) : logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload size={20} className="text-text-muted" />
                        )}
                      </div>

                      {/* ImageKit Wrapper */}
                      <IKContext
                        publicKey={
                          import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ||
                          "YOUR_PUBLIC_KEY"
                        }
                        urlEndpoint={
                          import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ||
                          "YOUR_URL_ENDPOINT"
                        }
                        authenticator={authenticator}
                      >
                        <div>
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                          >
                            {isUploadingLogo ? "Uploading..." : "Upload logo"}
                          </button>
                          {logoPreview && !isUploadingLogo && (
                            <button
                              type="button"
                              onClick={async () => {
                                setLogoPreview(null);
                                try {
                                  await updateProfileOnApi({
                                    ...clinic,
                                    logo: null, // Clear it in the DB
                                  });
                                  toast.info("Logo removed.");
                                } catch (err) {
                                  toast.error("Failed to remove logo.");
                                }
                              }}
                              className="ml-3 text-sm text-danger hover:underline"
                            >
                              Remove
                            </button>
                          )}
                          <p className="text-xs text-text-muted mt-0.5">
                            PNG, JPG up to 2MB. Shown in chatbot widget.
                          </p>
                        </div>

                        {/* Hidden ImageKit Input */}
                        <IKUpload
                          style={{ display: "none" }}
                          ref={fileRef} // Make sure this is ref, not inputRef based on your version
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files.length > 0)
                              setIsUploadingLogo(true);
                          }}
                          onError={(err) => {
                            console.error("ImageKit Upload Error:", err);
                            setIsUploadingLogo(false);
                            toast.error("Failed to upload logo.");
                          }}
                          onSuccess={async (res) => {
                            setIsUploadingLogo(false);
                            setLogoPreview(res.url); // Set the live URL

                            // ADDED: Auto-save directly to the database!
                            try {
                              await updateProfileOnApi({
                                ...clinic,
                                logo: res.url,
                              });
                              toast.success("Logo saved successfully!");
                            } catch (err) {
                              console.error("Failed to save logo to DB:", err);
                              toast.error(
                                "Logo uploaded, but failed to save to database.",
                              );
                            }
                          }}
                        />
                      </IKContext>
                    </div>
                  </div>

                  {[
                    {
                      name: "name",
                      label: "Clinic Name",
                      placeholder: "HealthFirst Clinic",
                    },
                    {
                      name: "website",
                      label: "Website URL",
                      placeholder: "https://yourclinic.com",
                    },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="text-xs font-medium text-text-secondary block mb-1.5">
                        {label}
                      </label>
                      <input
                        {...generalForm.register(name)}
                        placeholder={placeholder}
                        className="w-full h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
                      />
                      {generalForm.formState.errors[name] && (
                        <p className="mt-1 text-xs text-danger">
                          {generalForm.formState.errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">
                      About / Description
                    </label>
                    <textarea
                      {...generalForm.register("description")}
                      rows={4}
                      placeholder="A modern primary care clinic serving our community..."
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface resize-none focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      This is used by your AI to describe your clinic to
                      patients.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving || !generalForm.formState.isDirty} // Simplified!
                      className="h-9 px-5 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-60 flex items-center gap-2 transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Working Hours */}
              {section === "Working Hours" && (
                <div className="bg-surface border border-border rounded-md p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-h4 text-text-primary">
                        Working Hours
                      </h2>
                      <p className="text-xs text-text-muted mt-0.5">
                        Managed in a dedicated command center for advanced
                        schedules.
                      </p>
                    </div>
                    <Link
                      to="/working-hours"
                      className="h-8 px-3 inline-flex items-center rounded-md bg-primary text-primary-on text-xs font-semibold hover:bg-primary-hover transition-colors"
                    >
                      Open Manager
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-border rounded-md p-4 bg-surface-secondary">
                      <p className="text-xs text-text-muted">Timezone</p>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {workingHours.timezone}
                      </p>
                    </div>
                    <div className="border border-border rounded-md p-4 bg-surface-secondary">
                      <p className="text-xs text-text-muted">Open Days</p>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {coverage.openDays} / 7
                      </p>
                    </div>
                    <div className="border border-border rounded-md p-4 bg-surface-secondary">
                      <p className="text-xs text-text-muted">
                        Weekly Open Time
                      </p>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {coverage.weeklyOpenLabel}
                      </p>
                    </div>
                    <div className="border border-border rounded-md p-4 bg-surface-secondary">
                      <p className="text-xs text-text-muted">
                        Upcoming Override
                      </p>
                      <p className="text-sm font-semibold text-text-primary mt-1">
                        {nextOverride
                          ? `${nextOverride.date} (${nextOverride.type === "closed" ? "Closed" : "Custom"})`
                          : "No upcoming overrides"}
                      </p>
                    </div>
                  </div>

                  {coverage.warnings.length > 0 && (
                    <div className="mt-3 p-3 border border-warning/40 bg-warning-light rounded-md">
                      <p className="text-xs font-semibold text-text-primary mb-1">
                        Warnings
                      </p>
                      <ul className="text-xs text-text-secondary list-disc pl-4 space-y-0.5">
                        {coverage.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      to="/working-hours"
                      className="h-9 px-4 inline-flex items-center rounded-md border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      Configure detailed schedule
                    </Link>
                  </div>
                </div>
              )}

              {/* Services */}
              {section === "Services" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddServiceWithSave();
                  }}
                  className="bg-surface border border-border rounded-md p-6 space-y-4"
                >
                  <div>
                    <h2 className="text-h4 text-text-primary mb-1">Services</h2>
                    <p className="text-xs text-text-muted">
                      These appear in the chatbot's service selection step. Drag
                      to reorder.
                    </p>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleServiceDragEnd}
                  >
                    <SortableContext
                      items={services}
                      strategy={rectSortingStrategy}
                    >
                      <div className="flex flex-wrap gap-2">
                        {services.map((s) => (
                          <ServiceTag
                            key={s}
                            service={s}
                            onRemove={handleRemoveServiceWithSave}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">
                      Add New Service
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyDown={handleAddService}
                        placeholder="Enter service name"
                        disabled={saving}
                        className="flex-1 h-9 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={!newService.trim() || saving}
                        className="h-9 px-4 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-60 flex items-center gap-2 transition-colors"
                      >
                        {saving ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            Add Service
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Contact & Location */}
              {section === "Contact & Location" && (
                <form
                  onSubmit={contactForm.handleSubmit(saveContact)}
                  className="bg-surface border border-border rounded-md p-6 space-y-4"
                >
                  <h2 className="text-h4 text-text-primary">
                    Contact & Location
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "address",
                        label: "Street Address",
                        placeholder: "123 Medical Drive",
                      },
                      {
                        name: "city",
                        label: "City",
                        placeholder: "San Francisco",
                      },
                      {
                        name: "postalCode",
                        label: "Postal Code",
                        placeholder: "94102",
                      },
                      {
                        name: "phone",
                        label: "Phone",
                        placeholder: "+1 (415) 555-0000",
                      },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="text-xs font-medium text-text-secondary block mb-1.5">
                          {label}
                        </label>
                        <input
                          {...contactForm.register(name)}
                          placeholder={placeholder}
                          className="w-full h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
                        />
                        {contactForm.formState.errors[name] && (
                          <p className="mt-1 text-xs text-danger">
                            {contactForm.formState.errors[name].message}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-text-secondary block mb-1.5">
                        Email (read-only)
                      </label>
                      <input
                        disabled={true}
                        value={user?.email}
                        type="email"
                        className="w-full h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving || !contactForm.formState.isDirty}
                      className="h-9 px-5 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover disabled:opacity-60 flex items-center gap-2 transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Contact Info"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Danger Zone */}
              {section === "Danger Zone" && (
                <div className="border-2 border-danger/30 rounded-md p-6 space-y-4 bg-danger-light/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-danger" />
                    <h2 className="text-h4 text-danger">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-text-secondary">
                    These actions are permanent and cannot be undone.
                  </p>

                  {[
                    {
                      label: "Reset all FAQs",
                      desc: "Deletes all FAQ entries permanently.",
                      onClick: () => setResetOpen(true),
                      btn: "Reset FAQs",
                    },
                    {
                      label: "Delete Clinic Account",
                      desc: "Permanently deletes your account and all data.",
                      onClick: () => setDeleteOpen(true),
                      btn: "Delete Account",
                    },
                  ].map(({ label, desc, onClick, btn }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-4 bg-surface border border-danger/20 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {label}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={onClick}
                        className="h-9 px-4 text-sm font-semibold border-2 border-danger text-danger rounded-md hover:bg-danger hover:text-white transition-colors"
                      >
                        {btn}
                      </button>
                    </div>
                  ))}

                  <div className="p-4 bg-surface border border-border rounded-md">
                    <p className="text-sm font-semibold text-text-primary">
                      Download all data
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 mb-3">
                      Export all your clinic data (GDPR compliant).
                    </p>
                    <button className="h-8 px-4 text-xs font-medium border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors">
                      Export Data (.zip)
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetFaqs();
          setResetOpen(false);
          toast.success("All FAQs have been reset.");
        }}
        title="Reset all FAQs?"
        description="This will permanently delete all your FAQ entries. Your AI won't be able to answer questions from custom FAQs until you add them again."
        confirmLabel="Reset FAQs"
        confirmDanger
        requireType="RESET"
      />
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          toast.error("Account deletion requested. (Demo only)");
        }}
        title="Delete Clinic Account?"
        description="This permanently deletes your account, clinic data, FAQs, appointments, and removes your chatbot from all websites. This cannot be undone."
        confirmLabel="Delete Account"
        confirmDanger
        requireType="DELETE"
      />
    </div>
  );
}
