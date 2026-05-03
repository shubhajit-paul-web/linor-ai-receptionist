import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GripVertical,
  Sparkles,
  HelpCircle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EmptyState } from "../components/shared/EmptyState";
import { useToast } from "../components/shared/Toast";
import { faqSchema } from "../lib/validators";
import { cn, sleep } from "../lib/utils";
import useFaqStore from "../store/useFaqStore";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}

function FaqCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-md p-4">
      <div className="flex items-start gap-3">
        <SkeletonBlock className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-2.5 w-4 flex-shrink-0" />
            <SkeletonBlock className="h-3.5 w-3/4" />
          </div>
          <div className="flex items-start gap-2">
            <SkeletonBlock className="h-2.5 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock className="h-2.5 w-full" />
              <SkeletonBlock className="h-2.5 w-2/3" />
            </div>
          </div>
          <SkeletonBlock className="h-2 w-20" />
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <SkeletonBlock className="h-7 w-7 rounded-md" />
          <SkeletonBlock className="h-7 w-7 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ─── Sortable FAQ Card ────────────────────────────────────────────────────────

function FaqCard({ faq, onEdit, onDelete, isDeleting }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-surface border border-border rounded-md p-4",
        "group hover:border-border-strong transition-colors duration-100",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}

          className="flex-shrink-0 mt-0.5 text-text-muted opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <span className="text-label uppercase  flex-shrink-0">Q</span>
            <p className="text-sm font-semibold  leading-snug">
              {faq.question}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-label uppercase  flex-shrink-0">A</span>
            <p
              className={cn(
                "text-sm text-text-secondary leading-relaxed",
                !expanded && "line-clamp-2",
              )}
            >
              {faq.answer}
            </p>
          </div>
          {faq.answer.length > 120 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-primary mt-1 hover:underline flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUp size={12} />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={12} />
                  Show more
                </>
              )}
            </button>
          )}
          {/* Hit count */}
          <p className="text-[11px] text-text-muted mt-2">
            Asked {faq.hits} times
          </p>
        </div>

        {/* Actions (hover only) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(faq)}
            aria-label="Edit FAQ"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-secondary text-text-muted hover:text-primary transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            aria-label="Delete FAQ"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-danger-light text-text-muted hover:text-danger transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Inline delete confirmation (no modal for low-stakes action) */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border"
          >
            <p className="text-sm text-text-primary mb-2">
              Delete this FAQ?{" "}
              <span className="text-text-muted">This cannot be undone.</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDelete(faq._id);
                  setShowConfirm(false);
                }}
                disabled={isDeleting}
                className="h-8 px-3 text-xs font-semibold bg-danger text-white rounded-md hover:opacity-90 disabled:opacity-60"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="h-8 px-3 text-xs font-medium border border-border rounded-md hover:bg-surface-secondary text-text-secondary"
              >
                Keep
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Add / Edit Panel ─────────────────────────────────────────────────────────

function FaqPanel({ editing, onClose }) {
  const { addFaq, updateFaq } = useFaqStore();
  const toast = useToast();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: editing
      ? { question: editing.question, answer: editing.answer }
      : {},
  });

  const question = watch("question", "");
  const answer = watch("answer", "");

  const onSubmit = async (data) => {
    if (editing) {
      updateFaq(editing._id, data);
      toast.success("FAQ updated.");
    } else {
      addFaq(data);
      toast.success(
        "FAQ added! Your AI will use this in the next conversation.",
      );
    }
    onClose();
  };

  const handleAiAssist = async () => {
    if (!question.trim()) return;
    setAiLoading(true);
    // Simulate AI generation
    await sleep(1200);
    setValue(
      "answer",
      `Based on the question, here is a helpful answer about "${question}". Patients frequently ask this, so we recommend being clear and concise. You can edit this before saving.`,
    );
    setAiLoading(false);
  };

  return (
    <div className="bg-surface border border-border rounded-md p-5 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 text-text-primary">
          {editing ? "Edit FAQ" : "Add FAQ"}
        </h3>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Question */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Question
            </label>
            <span className="text-[11px] text-text-muted">
              {question.length}/200
            </span>
          </div>
          <textarea
            {...register("question")}
            rows={3}
            maxLength={200}
            placeholder="What are your opening hours?"
            className={cn(
              "w-full px-3 py-2 text-sm rounded-md border resize-none",
              "bg-surface text-text-primary placeholder:text-text-muted",
              "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors",
              errors.question ? "border-danger" : "border-border",
            )}
          />
          {errors.question && (
            <p className="mt-1 text-xs text-danger">
              {errors.question.message}
            </p>
          )}
        </div>

        {/* AI Assist toggle */}
        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-md border border-border">
          <div>
            <p className="text-xs font-medium text-text-primary">
              Auto-generate answer
            </p>
            <p className="text-[11px] text-text-muted">
              AI suggests an answer from your question
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
            />
            <span className="toggle-thumb" />
          </label>
        </div>

        {/* AI Assist button */}
        {aiEnabled && (
          <button
            type="button"
            onClick={handleAiAssist}
            disabled={aiLoading || !question.trim()}
            className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium border border-primary/30 text-primary bg-primary-light hover:bg-primary/10 rounded-md transition-colors disabled:opacity-60"
          >
            {aiLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Answer
              </>
            )}
          </button>
        )}
        {aiEnabled && answer && (
          <p className="text-[11px] text-warning">
            Review AI-generated answer before saving.
          </p>
        )}

        {/* Answer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Answer
            </label>
            <span className="text-[11px] text-text-muted">
              {answer.length}/500
            </span>
          </div>
          {aiLoading ? (
            <div className="h-24 rounded-md skeleton" />
          ) : (
            <textarea
              {...register("answer")}
              rows={5}
              maxLength={500}
              placeholder="We are open Monday to Friday from 9am to 5pm..."
              className={cn(
                "w-full px-3 py-2 text-sm rounded-md border resize-none",
                "bg-surface text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors",
                errors.answer ? "border-danger" : "border-border",
              )}
            />
          )}
          {errors.answer && (
            <p className="mt-1 text-xs text-danger">{errors.answer.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 text-sm font-medium border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-9 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover transition-colors"
          >
            {editing ? "Save Changes" : "Add FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── FAQs Page ────────────────────────────────────────────────────────────────

export default function FAQs() {
  const { isLoading, faqs, fetchFaqs, deleteFaq, reorderFaqs, updateFaq } =
    useFaqStore();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        await fetchFaqs();
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setHasInitialized(true);
      }
    };
    loadFaqs();
  }, [fetchFaqs]);

  const showSkeleton = isLoading || !hasInitialized;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const filtered = useMemo(() => {
    if (!search) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase()),
    );
  }, [faqs, search]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = faqs.findIndex((f) => f.id === active.id);
      const newIdx = faqs.findIndex((f) => f.id === over.id);
      reorderFaqs(arrayMove(faqs, oldIdx, newIdx));
    }
  };

  const handleDelete = (id) => {
    deleteFaq(id);
    toast.success("FAQ deleted.");
  };

  const handleEdit = (faq) => {
    setEditing(faq);
    setPanelOpen(true);

    
  };

  const handleClose = () => {
    setPanelOpen(false);
    setEditing(null);
  };

  return (
    <div className="max-w-[1400px]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-h2 text-text-primary">FAQs</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {showSkeleton ? (
              <span className="inline-block skeleton h-3.5 w-56 rounded align-middle" />
            ) : (
              `${faqs.length} FAQs — your AI uses these to answer patient questions.`
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setPanelOpen(true);
          }}
          className="h-9 px-4 flex items-center gap-2 text-sm font-semibold bg-primary text-primary-on rounded-md hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      {showSkeleton ? (
        <div className="mb-4 max-w-sm">
          <div className="skeleton h-9 w-full rounded-md" />
        </div>
      ) : (
        <>
          <div className="relative mb-4 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full h-9 pl-9 pr-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
            />
          </div>
          {search && (
            <p className="text-sm text-text-muted mb-3">
              {filtered.length} of {faqs.length} FAQs match "{search}"
            </p>
          )}
        </>
      )}

      {/* ── Main Layout ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex gap-5",
          panelOpen ? "grid grid-cols-[1fr_360px]" : "",
        )}
      >
        {/* List */}
        <div className="flex-1 min-w-0">
          {showSkeleton ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaqCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title={search ? "No FAQs match your search" : "No FAQs yet"}
              description={
                search
                  ? "Try a different search term."
                  : "Add your first FAQ to help your AI give better answers."
              }
              action={
                !search
                  ? {
                      label: "Add Your First FAQ",
                      onClick: () => setPanelOpen(true),
                    }
                  : undefined
              }
            />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filtered.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {filtered.map((faq) => (
                    <FaqCard
                      key={faq._id}
                      faq={faq}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Edit/Add Panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
              className="w-[360px] flex-shrink-0"
            >
              <FaqPanel editing={editing} onClose={handleClose}  />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
