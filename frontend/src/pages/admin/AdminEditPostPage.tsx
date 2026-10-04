import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { PostStatus, FeaturedImage } from '../../types';
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
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  ChevronDown,
  ChevronRight,
  Globe,
  HelpCircle,
  Languages,
  Image as ImageIcon,
  Archive,
  Copy
} from 'lucide-react';

export const AdminEditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => apiClient.getPost(id!),
    enabled: Boolean(id)
  });

  // Taxonomies
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

  // Local Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
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

  // Status & Scheduling
  const [currentStatus, setCurrentStatus] = useState<PostStatus>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  // Format Specific Data
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [sortedListItems, setSortedListItems] = useState<any[]>([]);
  const [videoDetails, setVideoDetails] = useState<any>({ videoUrl: '', provider: 'youtube' });
  const [audioDetails, setAudioDetails] = useState<any>({ audioUrl: '' });
  const [pollDetails, setPollDetails] = useState<any>({ question: '', options: [] });
  const [eventDetails, setEventDetails] = useState<any>({});

  // Advanced Panels State
  const [seo, setSeo] = useState<any>({});
  const [faq, setFaq] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [openSection, setOpenSection] = useState<'seo' | 'faq' | 'translations' | null>(null);

  // Modals
  const [isFeaturedMediaOpen, setIsFeaturedMediaOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate data when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setSlug(post.slug || '');
      setSummary(post.summary || '');
      setContent(post.content || '');
      setCategoryId(typeof post.category === 'object' ? post.category?._id || '' : post.category || '');
      setLanguageId(typeof post.language === 'object' ? post.language?._id || '' : post.language || '');
      setSelectedTagIds(
        (post.tags || []).map((t) => (typeof t === 'object' ? t._id || t.id : t) as string)
      );
      setFeaturedImage(post.featuredImage);
      setIsFullWidth(post.isFullWidth || false);
      setRegisteredOnly(post.registeredOnly || false);
      setIsFeatured(post.isFeatured || false);
      setIsBreaking(post.isBreaking || false);
      setExternalUrl(post.externalUrl || '');
      setCurrentStatus(post.status);
      setScheduledAt(post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '');

      if (post.galleryItems) setGalleryItems(post.galleryItems);
      if (post.sortedListItems) setSortedListItems(post.sortedListItems);
      if (post.videoDetails) setVideoDetails(post.videoDetails);
      if (post.audioDetails) setAudioDetails(post.audioDetails);
      if (post.pollDetails) setPollDetails(post.pollDetails);
      if (post.eventDetails) setEventDetails(post.eventDetails);

      if (post.seo) setSeo(post.seo);
      if (post.faq) setFaq(post.faq);
      if (post.translations) setTranslations(post.translations);
    }
  }, [post]);

  const handleSave = async (status: PostStatus) => {
    if (!title.trim() || title.length < 3) {
      showToast('Please provide a title with at least 3 characters', 'error');
      return;
    }

    if (status === 'scheduled' && !scheduledAt) {
      showToast('Please select a date for scheduled publishing', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        content,
        category: categoryId,
        language: languageId,
        tags: selectedTagIds,
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

      if (post?.postFormat === 'gallery') payload.galleryItems = galleryItems;
      if (post?.postFormat === 'sorted_list') payload.sortedListItems = sortedListItems;
      if (post?.postFormat === 'video') payload.videoDetails = videoDetails;
      if (post?.postFormat === 'audio') payload.audioDetails = audioDetails;
      if (post?.postFormat === 'poll') payload.pollDetails = pollDetails;
      if (post?.postFormat === 'event') payload.eventDetails = eventDetails;

      await apiClient.updatePost(id!, payload);
      setCurrentStatus(status);
      showToast(`Changes saved successfully (${status})!`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-post', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    } catch (err: any) {
      showToast(err.message || 'Failed to update post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await apiClient.duplicatePost(id!);
      showToast(`Post duplicated as "${duplicated.title}"`, 'success');
      navigate(`/admin/posts/${duplicated._id}/edit`);
    } catch (err: any) {
      showToast(err.message || 'Duplicate failed', 'error');
    }
  };

  const handleTrash = async () => {
    try {
      await apiClient.deletePost(id!, false);
      showToast('Post moved to trash', 'info');
      navigate('/admin/posts');
    } catch (err: any) {
      showToast(err.message || 'Move to trash failed', 'error');
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading dispatch editor...</div>;
  }

  if (!post) {
    return (
      <div className="p-12 text-center space-y-3">
        <h2 className="text-sm font-bold text-slate-700">Dispatch Not Found</h2>
        <Link to="/admin/posts">
          <Button size="sm">Back to Dispatches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Sticky Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-750 sticky top-0 bg-slate-50/95 dark:bg-navy-900/95 backdrop-blur z-20 pt-2">
        <div className="flex items-center gap-3">
          <Link to="/admin/posts">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dispatches
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white truncate max-w-sm">
                Edit Dispatch
              </h1>
              <Badge variant="primary" size="sm" className="capitalize">
                {post.postFormat.replace('_', ' ')}
              </Badge>
              <Badge
                variant={
                  currentStatus === 'published'
                    ? 'success'
                    : currentStatus === 'scheduled'
                    ? 'warning'
                    : 'outline'
                }
                size="sm"
                className="capitalize"
              >
                {currentStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preview button */}
          <Link to={`/admin/posts/${post._id}/preview`} target="_blank">
            <Button size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5" />}>
              Preview
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Duplicate
          </Button>

          {/* Save Draft */}
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

          {/* Schedule */}
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
                  <Button size="sm" variant="outline" onClick={() => setIsSchedulingOpen(false)}>
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
                    Set Schedule
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Publish / Unpublish */}
          {currentStatus === 'published' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSave('draft')}
              disabled={isSubmitting}
              leftIcon={<Archive className="w-3.5 h-3.5" />}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => handleSave('published')}
              disabled={isSubmitting}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              Publish Now
            </Button>
          )}

          <button
            type="button"
            onClick={handleTrash}
            className="p-2 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title="Move to trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form: 8 Cols Content + 4 Cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-4 sm:p-6 space-y-4 bg-white dark:bg-navy-850">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Dispatch Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg sm:text-xl font-bold p-3 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:border-editorial-red"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">slug: /</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
                </div>
              )}
            </div>

            {/* Format-Specific Editors */}
            <div className="pt-4 border-t border-slate-100 dark:border-navy-750">
              {post.postFormat === 'gallery' && (
                <GalleryEditor items={galleryItems} onChange={setGalleryItems} />
              )}

              {post.postFormat === 'sorted_list' && (
                <SortedListEditor items={sortedListItems} onChange={setSortedListItems} />
              )}

              {post.postFormat === 'video' && (
                <VideoEditor details={videoDetails} onChange={setVideoDetails} />
              )}

              {post.postFormat === 'audio' && (
                <AudioEditor details={audioDetails} onChange={setAudioDetails} />
              )}

              {post.postFormat === 'poll' && (
                <PollEditor details={pollDetails} onChange={setPollDetails} />
              )}

              {post.postFormat === 'event' && (
                <EventEditor details={eventDetails} onChange={setEventDetails} />
              )}
            </div>

            {/* TipTap Rich Text Editor */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-navy-750">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {post.postFormat === 'article' || post.postFormat === 'table_of_contents'
                  ? 'Article Body Content (TipTap WYSIWYG)'
                  : 'Editorial Commentary / Context'}
              </label>
              <TipTapEditor content={content} onChange={setContent} minHeight="380px" />
            </div>
          </Card>

          {/* Advanced Accordions */}
          <div className="space-y-3">
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

        {/* Sidebar Settings (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-4 space-y-4 bg-white dark:bg-navy-850">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-navy-750">
              Taxonomy & Language
            </h3>

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
