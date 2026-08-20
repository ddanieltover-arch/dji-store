import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Camera,
  Filter,
  Plus,
  ShieldCheck,
  Award,
  ChevronDown,
  X,
  MessageSquare,
  Sparkles,
  Plane,
  AlertCircle
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { useStore } from '../context/StoreContext';
import { calculateReviewSummary } from '../data/reviews';

interface ReviewsSectionProps {
  product: Product;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ product }) => {
  const { reviews, addReview, voteReviewHelpful } = useStore();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterWithMedia, setFilterWithMedia] = useState(false);
  const [sortBy, setSortBy] = useState<'most_helpful' | 'newest' | 'highest'>('most_helpful');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // New review form state
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCert, setFormCert] = useState<ProductReview['pilotCertification']>('A1/A3 Open');
  const [formProInput, setFormProInput] = useState('');
  const [formPros, setFormPros] = useState<string[]>([]);
  const [formConInput, setFormConInput] = useState('');
  const [formCons, setFormCons] = useState<string[]>([]);
  const [formSerial, setFormSerial] = useState('');

  const summary = calculateReviewSummary(reviews, product.id);

  // Filter and sort reviews
  const approvedReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  const displayedReviews = approvedReviews
    .filter((r) => {
      if (filterRating !== 'all' && Math.round(r.rating) !== filterRating) return false;
      if (filterVerified && !r.verifiedPurchase) return false;
      if (filterWithMedia && (!r.media || r.media.length === 0)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'most_helpful') return b.helpfulVotes - a.helpfulVotes;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      return 0;
    });

  const handleAddPro = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (formProInput.trim()) {
      setFormPros([...formPros, formProInput.trim()]);
      setFormProInput('');
    }
  };

  const handleAddCon = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (formConInput.trim()) {
      setFormCons([...formCons, formConInput.trim()]);
      setFormConInput('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor || !formTitle || !formContent) return;

    addReview({
      productId: product.id,
      authorName: formAuthor,
      authorLocation: formLocation || 'European Union',
      countryCode: 'EU',
      rating: formRating,
      title: formTitle,
      content: formContent,
      pros: formPros,
      cons: formCons,
      verifiedPurchase: !!formSerial,
      verifiedSerialNumber: formSerial || undefined,
      pilotCertification: formCert,
      media: []
    });

    setIsWriteModalOpen(false);
    // Reset form
    setFormAuthor('');
    setFormLocation('');
    setFormTitle('');
    setFormContent('');
    setFormPros([]);
    setFormCons([]);
    setFormSerial('');
  };

  return (
    <div id="product-reviews" className="space-y-8 pt-10 border-t border-gray-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Verified European Pilots
            </span>
            <span className="text-xs text-gray-500">EASA Compliant Flight Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Customer Reviews & Flight Reports ({summary.totalReviews})
          </h2>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Write a Pilot Review
        </button>
      </div>

      {/* Ratings & Attribute Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-gray-900 tracking-tight">
              {summary.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400 font-bold text-lg">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-gray-500 font-medium">
            Based on {summary.totalReviews} verified European flight logs ({summary.totalVerifiedPurchases} verified serial numbers).
          </p>
        </div>

        {/* Star Distribution Bars */}
        <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.starCounts[star as keyof typeof summary.starCounts] || 0;
            const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div
                key={star}
                onClick={() => setFilterRating(filterRating === star ? 'all' : (star as number))}
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-black cursor-pointer group"
              >
                <span className="w-10 font-bold flex items-center gap-0.5">
                  {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full group-hover:bg-amber-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px] text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Technical Attribute Scores */}
        <div className="md:col-span-4 space-y-3 flex flex-col justify-center text-xs">
          <span className="font-bold text-gray-900 text-xs block">Technical Field Performance</span>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-600">Camera & Color Science</span>
              <span className="font-bold text-gray-900">{summary.attributeScores.cameraQuality}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${summary.attributeScores.cameraQuality}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-600">Flight Endurance (Real World)</span>
              <span className="font-bold text-gray-900">{summary.attributeScores.batteryEndurance}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${summary.attributeScores.batteryEndurance}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-600">O4+ Video Transmission Stability</span>
              <span className="font-bold text-gray-900">{summary.attributeScores.transmissionStability}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${summary.attributeScores.transmissionStability}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterRating === 'all'
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Ratings ({approvedReviews.length})
          </button>

          <button
            onClick={() => setFilterVerified(!filterVerified)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              filterVerified
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Purchases Only
          </button>

          <button
            onClick={() => setFilterWithMedia(!filterWithMedia)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              filterWithMedia
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            With Flight Photos
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-black"
          >
            <option value="most_helpful">Most Helpful European Reviews</option>
            <option value="newest">Latest Submissions</option>
            <option value="highest">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-gray-900">No reviews match your selected filter</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try removing some filter criteria or be the first to submit a flight report for this model.
            </p>
            <button
              onClick={() => {
                setFilterRating('all');
                setFilterVerified(false);
                setFilterWithMedia(false);
              }}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-4"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-800 text-sm">
                    {review.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{review.authorName}</span>
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Verified EU Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{review.authorLocation}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.pilotCertification && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">
                            {review.pilotCertification} License
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{review.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{review.content}</p>
              </div>

              {/* Pros & Cons Pills */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {review.pros.length > 0 && (
                    <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        Pros & Flight Highlights
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-950 font-medium">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons.length > 0 && (
                    <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                        Considerations & Advice
                      </span>
                      <ul className="space-y-1 text-xs text-rose-950 font-medium">
                        {review.cons.map((con, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Uploaded Flight Media */}
              {review.media && review.media.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {review.media.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => setSelectedPhoto(med.url)}
                      className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity relative group"
                    >
                      <img src={med.url} alt={med.caption || 'Flight sample'} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Official Store Admin Response */}
              {review.adminResponse && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black text-white font-extrabold text-[9px] uppercase">
                      Official Response
                    </span>
                    <span className="font-bold text-gray-900">{review.adminResponse.author}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.adminResponse.message}</p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <button
                  onClick={() => voteReviewHelpful(review.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                    review.userVotedHelpful
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${review.userVotedHelpful ? 'fill-blue-600' : ''}`} />
                  <span>Helpful ({review.helpfulVotes})</span>
                </button>

                {review.verifiedSerialNumber && (
                  <span className="font-mono text-[10px] text-gray-400">
                    Serial: {review.verifiedSerialNumber}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">Write a European Pilot Review</h3>
                <p className="text-xs text-gray-500">{product.modelName}</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">Overall Flight Experience Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-gray-800 ml-2">{formRating} of 5 Stars</span>
                </div>
              </div>

              {/* Author and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marc Richter"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">City & Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Berlin, Germany"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>
              </div>

              {/* EASA License Certification */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  EASA Remote Pilot Certification (Optional)
                </label>
                <select
                  value={formCert}
                  onChange={(e) => setFormCert(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs"
                >
                  <option value="A1/A3 Open">Open Category A1/A3 (Proof of Competency)</option>
                  <option value="A2 Certificate">Open Category A2 (Remote Pilot Certificate)</option>
                  <option value="STS Commercial">Specific Category STS Commercial Operator</option>
                  <option value="Recreational Enthusiast">Recreational Hobbyist (&lt;249g C0)</option>
                </select>
              </div>

              {/* Serial Number for Verified Badge */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  DJI Hardware Serial Number (For Verified Purchase Badge)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1581F4Q... (found on retail box or battery bay)"
                  value={formSerial}
                  onChange={(e) => setFormSerial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs font-mono"
                />
              </div>

              {/* Review Headline */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flawless 8K HDR and rock solid O4+ video transmission"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              {/* Review Body */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Detailed Flight Experience</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your flight conditions, battery endurance, camera dynamic range, gimbal stability, and European airspace experience..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              {/* Pros & Cons Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Add Pro (Press Enter)</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="e.g. 46 min flight time"
                      value={formProInput}
                      onChange={(e) => setFormProInput(e.target.value)}
                      onKeyDown={handleAddPro}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddPro}
                      className="px-3 bg-emerald-600 text-white rounded-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                  {formPros.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {formPros.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Add Con (Press Enter)</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="e.g. Premium price"
                      value={formConInput}
                      onChange={(e) => setFormConInput(e.target.value)}
                      onKeyDown={handleAddCon}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCon}
                      className="px-3 bg-rose-600 text-white rounded-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                  {formCons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {formCons.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded-lg text-[10px] font-bold">
                          ✗ {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs shadow-sm"
                >
                  Submit for European Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl bg-black">
            <img src={selectedPhoto} alt="Review Enlarge" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
