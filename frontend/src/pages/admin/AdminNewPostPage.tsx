import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { PostFormat, PostStatus, FeaturedImage } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Checkbox } from '../../components/ui/Checkbox';
import { useToast } from '../../components/ui/Toast';
import { TipTapEditor } from '../../components/editor/TipTapEditor';
import { MediaLibraryModal } from '../../components/media/MediaLibraryModal';
import { GalleryEditor } from '../../components/cms/GalleryEditor';
import { SortedListEditor } from '../../components/cms/SortedListEditor';
import { VideoEditor } from '../../components/cms/VideoEditor';
import { AudioEditor } from '../../components/cms/AudioEditor';
import { PollEditor } from '../../components/cms/PollEditor';
import { EventEditor } from '../../components/cms/EventEditor';
import { SeoSettingsPanel } from '../../components/cms/SeoSettingsPanel';
import { FaqEditorPanel } from '../../components/cms/FaqEditorPanel';
import { TranslationsPanel } from '../../components/cms/TranslationsPanel';
import { slugify } from '../../lib/utils';
import {
  FileText,
  Image as ImageIcon,
  ListOrdered,
  BookOpen,
  Film,
  Music,
  BarChart3,
  Calendar,
  ArrowLeft,
  Save,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronRight,
  Globe,
  HelpCircle,
  Languages
} from 'lucide-react';

const FORMAT_CONFIGS: {
  id: PostFormat;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'article',
    title: 'Standard Article',
    description: 'Traditional investigative reporting, op-eds, and deep-dive news stories.',
    icon: <FileText className="w-6 h-6 text-editorial-red" />
  },
  {
    id: 'gallery',
    title: 'Photo Gallery',
    description: 'High-resolution photo essays, field reportage, and multi-slide photojournalism.',
    icon: <ImageIcon className="w-6 h-6 text-amber-500" />
  },
  {
    id: 'sorted_list',
    title: 'Sorted List',
    description: 'Ranked countdowns, top ten dispatches, and numbered investigative breakdowns.',
    icon: <ListOrdered className="w-6 h-6 text-emerald-500" />
  },
  {
    id: 'table_of_contents',
    title: 'Table of Contents',
    description: 'Long-form special reports with structured headings and auto-indexed sections.',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />
  },
  {
    id: 'video',
    title: 'Video Dispatch',
    description: 'Broadcast reports, video interviews, and YouTube or Vimeo streaming embeds.',
    icon: <Film className="w-6 h-6 text-rose-500" />
  },
  {
    id: 'audio',
    title: 'Audio Report',
    description: 'Audio recordings, correspondent voice memos, and digital radio dispatches.',
    icon: <Music className="w-6 h-6 text-purple-500" />
  },
  {
    id: 'poll',
    title: 'Opinion Poll',
    description: 'Audience inquiry questions with customizable options and voting windows.',
    icon: <BarChart3 className="w-6 h-6 text-cyan-500" />
  },
  {
    id: 'event',
    title: 'Newsroom Event',
    description: 'Press conferences, summits, and physical gatherings with dates and maps.',
    icon: <Calendar className="w-6 h-6 text-orange-500" />
  }
];

export const AdminNewPostPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFormat, setSelectedFormat] = useState<PostFormat | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<FeaturedImage | undefined>();
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [registeredOnly, setRegisteredOnly] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  // Scheduling
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  // Format Specific Data
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [sortedListItems, setSortedListItems] = useState<any[]>([]);
  const [videoDetails, setVideoDetails] = useState<any>({ videoUrl: '', provider: 'youtube' });
  const [audioDetails, setAudioDetails] = useState<any>({ audioUrl: '' });
  const [pollDetails, setPollDetails] = useState<any>({ question: '', options: [{ id: '1', text: '' }, { id: '2', text: '' }] });
  const [eventDetails, setEventDetails] = useState<any>({});

  // Advanced Panels State
  const [seo, setSeo] = useState<any>({});
  const [faq, setFaq] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);

  // Accordion toggles
  const [openSection, setOpenSection] = useState<'seo' | 'faq' | 'translations' | null>(null);

  // Media Library Modal
  const [isFeaturedMediaOpen, setIsFeaturedMediaOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries for taxonomies
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories()
  });

  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: () => apiClient.getLanguages()
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getTags()
  });

  // Set default category and language when available
  React.useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0]._id || categories[0].id || '');
    }
  }, [categories, categoryId]);

  React.useEffect(() => {
    if (languages.length > 0 && !languageId) {
      const def = languages.find(l => l.isDefault) || languages[0];
      setLanguageId(def._id || def.id || '');
    }
  }, [languages, languageId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (status: PostStatus) => {
    if (!title.trim() || title.length < 3) {
      showToast('Please provide a title with at least 3 characters', 'error');
      return;
    }

    if (!categoryId) {
      showToast('Please select an editorial category', 'error');
      return;
    }

    if (!languageId) {
      showToast('Please select a language locale', 'error');
      return;
    }

    if (status === 'scheduled' && !scheduledAt) {
      showToast('Please choose a date and time for scheduled publication', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        summary: summary.trim(),
        content,
        category: categoryId,
        language: languageId,
        tags: selectedTagIds,
        postFormat: selectedFormat || 'article',
        featuredImage,
        status,
        scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
        isFullWidth,
        registeredOnly,
        isFeatured,
        isBreaking,
        externalUrl: externalUrl.trim(),
        seo,
        faq,
        translations
      };

      if (selectedFormat === 'gallery') payload.galleryItems = galleryItems;
      if (selectedFormat === 'sorted_list') payload.sortedListItems = sortedListItems;
      if (selectedFormat === 'video') payload.videoDetails = videoDetails;
      if (selectedFormat === 'audio') payload.audioDetails = audioDetails;
      if (selectedFormat === 'poll') payload.pollDetails = pollDetails;
      if (selectedFormat === 'event') payload.eventDetails = eventDetails;

      await apiClient.createPost(payload);
      showToast(`Post successfully saved as ${status}!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      navigate('/admin/posts');
    } catch (err: any) {
      showToast(err.message || 'Failed to save post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Format Chooser
  if (!selectedFormat) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-navy-750">
          <Link to="/admin/posts">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dispatches
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Choose Post Format
            </h1>
            <p className="text-xs text-slate-500">
              Select the editorial architecture best suited for this dispatch.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FORMAT_CONFIGS.map((fmt) => (
            <Card
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className="p-5 cursor-pointer hover:border-editorial-red/60 transition-all hover:shadow-md flex flex-col justify-between group bg-white dark:bg-navy-850"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900 w-fit group-hover:scale-110 transition-transform">
                  {fmt.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-editorial-red transition-colors">
                    {fmt.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {fmt.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-750 flex items-center justify-between text-xs font-bold text-editorial-red">
                <span>Select Format</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Post Editor
  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Publishing Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-750 sticky top-0 bg-slate-50/95 dark:bg-navy-900/95 backdrop-blur z-20 pt-2">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedFormat(null)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Formats
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                New Dispatch
              </h1>
              <Badge variant="primary" size="sm" className="capitalize">
                {selectedFormat.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>

          {/* Schedule Button & Popup Toggle */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSchedulingOpen(!isSchedulingOpen)}
              leftIcon={<Clock className="w-3.5 h-3.5" />}
            >
              Schedule
            </Button>

            {isSchedulingOpen && (
              <div className="absolute right-0 mt-2 p-3 w-72 bg-white dark:bg-navy-850 rounded-lg shadow-xl border border-slate-200 dark:border-navy-700 z-30 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Publishing Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none"
                />
                <div className="flex justify-end gap-1.5 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSchedulingOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsSchedulingOpen(false);
                      handleSave('scheduled');
                    }}
                    disabled={!scheduledAt}
                  >
                    Confirm Schedule
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSave('published')}
            disabled={isSubmitting}
            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
          >
            Publish Now
          </Button>
        </div>
      </div>

      {/* Editor Body: 8 Col Content + 4 Col Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-4 sm:p-6 space-y-4 bg-white dark:bg-navy-850">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Dispatch Headline / Title *
              </label>
              <input
                type="text"
                placeholder="Enter compelling article headline..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg sm:text-xl font-bold p-3 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:border-editorial-red"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">slug: /</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugCustomized(true);
                }}
                placeholder="auto-generated-slug"
                className="flex-1 px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-editorial-red"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Editorial Summary / Dek
              </label>
              <textarea
                rows={2}
                placeholder="Brief 1-2 sentence lead summarizing the story for previews and indexing..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:border-editorial-red"
              />
            </div>

            {/* Featured Image */}
            <div className="pt-2 border-t border-slate-100 dark:border-navy-750">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Primary Featured Image
              </label>
              {featuredImage?.url ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-navy-700 aspect-video max-w-md">
                  <img src={featuredImage.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(undefined)}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-rose-600 transition-colors"
                    title="Remove featured image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {featuredImage.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 text-[11px] text-white truncate">
                      {featuredImage.caption}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => setIsFeaturedMediaOpen(true)}
                  className="border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-lg p-6 text-center cursor-pointer hover:border-editorial-red transition-colors max-w-md"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-editorial-red">
                    Choose from Media Library
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Attaches lead photography for homepage and card previews
                  </p>
                </div>
              )}
            </div>

            {/* Format-Specific Editors */}
            <div className="pt-4 border-t border-slate-100 dark:border-navy-750">
              {selectedFormat === 'gallery' && (
                <GalleryEditor items={galleryItems} onChange={setGalleryItems} />
              )}

              {selectedFormat === 'sorted_list' && (
                <SortedListEditor items={sortedListItems} onChange={setSortedListItems} />
              )}

              {selectedFormat === 'video' && (
                <VideoEditor details={videoDetails} onChange={setVideoDetails} />
              )}

              {selectedFormat === 'audio' && (
                <AudioEditor details={audioDetails} onChange={setAudioDetails} />
              )}

              {selectedFormat === 'poll' && (
                <PollEditor details={pollDetails} onChange={setPollDetails} />
              )}

              {selectedFormat === 'event' && (
                <EventEditor details={eventDetails} onChange={setEventDetails} />
              )}
            </div>

            {/* Rich Text Editor for Body / Background */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-navy-750">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {selectedFormat === 'article' || selectedFormat === 'table_of_contents'
                  ? 'Article Body Content (TipTap WYSIWYG)'
                  : 'Editorial Commentary / Context'}
              </label>
              <TipTapEditor content={content} onChange={setContent} minHeight="380px" />
            </div>
          </Card>

          {/* Advanced Collapsible Accordions: SEO, FAQ, Translations */}
          <div className="space-y-3">
            {/* SEO Accordion */}
            <Card className="overflow-hidden">
              <div
                onClick={() => setOpenSection(openSection === 'seo' ? null : 'seo')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-editorial-red" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Search Engine Optimization & Open Graph
                  </span>
                </div>
                {openSection === 'seo' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              {openSection === 'seo' && (
                <div className="p-4 border-t border-slate-200 dark:border-navy-750">
                  <SeoSettingsPanel
                    seo={seo}
                    onChange={setSeo}
                    defaultTitle={title}
                    defaultDescription={summary}
                  />
                </div>
              )}
            </Card>

            {/* FAQ Accordion */}
            <Card className="overflow-hidden">
              <div
                onClick={() => setOpenSection(openSection === 'faq' ? null : 'faq')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-editorial-red" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Structured FAQ Accordion ({faq.length})
                  </span>
                </div>
                {openSection === 'faq' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              {openSection === 'faq' && (
                <div className="p-4 border-t border-slate-200 dark:border-navy-750">
                  <FaqEditorPanel faq={faq} onChange={setFaq} />
                </div>
              )}
            </Card>

            {/* Multilingual Translations Accordion */}
            <Card className="overflow-hidden">
              <div
                onClick={() => setOpenSection(openSection === 'translations' ? null : 'translations')}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-editorial-red" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Multilingual Translations ({translations.length})
                  </span>
                </div>
                {openSection === 'translations' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              {openSection === 'translations' && (
                <div className="p-4 border-t border-slate-200 dark:border-navy-750">
                  <TranslationsPanel
                    translations={translations}
                    onChange={setTranslations}
                    availableLanguages={languages}
                    currentLanguageId={languageId}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar Publishing Settings (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Taxonomy & Locale Settings */}
          <Card className="p-4 space-y-4 bg-white dark:bg-navy-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-navy-750">
              Taxonomy & Language
            </h3>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Editorial Desk / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:border-editorial-red"
              >
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Dispatch Language *
              </label>
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="w-full p-2 text-xs rounded border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:border-editorial-red"
              >
                {languages.map((lang) => (
                  <option key={lang._id || lang.id} value={lang._id || lang.id}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Multi-select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Editorial Tags
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-navy-700 rounded bg-slate-50 dark:bg-navy-900">
                {tags.map((tag) => {
                  const tagId = tag._id || tag.id || '';
                  const isChecked = selectedTagIds.includes(tagId);
                  return (
                    <button
                      key={tagId}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedTagIds(selectedTagIds.filter((t) => t !== tagId));
                        } else {
                          setSelectedTagIds([...selectedTagIds, tagId]);
                        }
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                        isChecked
                          ? 'bg-editorial-red text-white'
                          : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-700'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Presentation & Access Settings */}
          <Card className="p-4 space-y-3 bg-white dark:bg-navy-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-navy-750">
              Display & Access Controls
            </h3>

            <Checkbox
              label="Featured on Homepage"
              description="Pins this story to the lead hero section of the front page."
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />

            <Checkbox
              label="Breaking News Alert"
              description="Displays this article in the top breaking news ticker across the platform."
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
            />

            <Checkbox
              label="Full-Width Article Layout"
              description="Hides reading sidebar for broad editorial immersion."
              checked={isFullWidth}
              onChange={(e) => setIsFullWidth(e.target.checked)}
            />

            <Checkbox
              label="Subscriber / Registered Users Only"
              description="Requires readers to be signed in to read the full piece."
              checked={registeredOnly}
              onChange={(e) => setRegisteredOnly(e.target.checked)}
            />

            <div className="pt-2">
              <Input
                label="External Canonical Link / Syndicate"
                placeholder="https://original-publisher.example.org"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Featured Image Picker Modal */}
      <MediaLibraryModal
        isOpen={isFeaturedMediaOpen}
        onClose={() => setIsFeaturedMediaOpen(false)}
        onSelect={(asset) => {
          setFeaturedImage({
            url: asset.secureUrl || asset.url,
            publicId: asset.publicId,
            alt: asset.alt || asset.originalFilename,
            caption: asset.caption || ''
          });
        }}
        allowedTypes={['image']}
        title="Select Featured Lead Image"
      />
    </div>
  );
};
