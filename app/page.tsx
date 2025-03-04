/// <reference types="react" />
"use client";

import { useState } from "react";
import { generateNameMeaning, generateNameSuggestion } from "./services/api";

interface FormData {
  gender: string;
  heritage: string[];
  nameType: string;
  lengthPreference: string;
  meanings: string[];
  customMeaning: string;
  firstLetter: string;
  popularity: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    heritage: [],
    nameType: '',
    lengthPreference: '',
    meanings: [],
    customMeaning: '',
    firstLetter: '',
    popularity: ''
  });
  const [suggestedNames, setSuggestedNames] = useState<Array<{
    name: string;
    origin: string;
    meaning: string;
    explanation: string;
    originalScript?: string;
  }>>([]);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeritageModalOpen, setIsHeritageModalOpen] = useState(false);
  const [isMeaningModalOpen, setIsMeaningModalOpen] = useState(false);

  const heritageOptions = [
    { value: 'english', label: 'Anglo-Saxon' },
    { value: 'celtic', label: 'Celtic' },
    { value: 'norse', label: 'Norse' },
    { value: 'greek', label: 'Greek' },
    { value: 'roman', label: 'Roman' },
    { value: 'hebrew', label: 'Hebrew' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'persian', label: 'Persian' },
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'african', label: 'African' },
    { value: 'slavic', label: 'Slavic' },
    { value: 'german', label: 'Germanic' },
    { value: 'french', label: 'French' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'italian', label: 'Italian' },
  ];

  const meaningOptions = [
    'nature',
    'strength',
    'wisdom',
    'love',
    'peace',
    'courage',
    'hope',
    'joy',
    'light',
    'grace',
    'victory',
    'beauty',
    'faith',
    'honor',
    'truth'
  ];

  const handleToggleSelect = (field: keyof FormData, value: string) => {
    if (field === 'heritage' || field === 'meanings') {
      setFormData(prev => {
        const currentValues = prev[field] as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [field]: newValues };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field] === value ? '' : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestedNames([]);

    try {
      const result = await generateNameSuggestion({
        heritage: formData.heritage,
        meanings: [...formData.meanings, formData.customMeaning].filter(Boolean),
        gender: formData.gender,
        length: formData.lengthPreference,
        firstLetter: formData.firstLetter,
        popularity: formData.popularity
      });

      setSuggestedNames(result.names);
      setCurrentNameIndex(0);
    } catch (error) {
      console.error('Error generating name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextName = () => {
    setCurrentNameIndex((prev) => (prev + 1) % suggestedNames.length);
  };

  const prevName = () => {
    setCurrentNameIndex((prev) => (prev - 1 + suggestedNames.length) % suggestedNames.length);
  };

  return (
    <main className={`min-h-screen p-8 transition-all duration-1000 ease-in-out bg-gradient-to-br ${
      formData.gender === 'girl' 
        ? 'from-pink-200 via-pink-50 to-rose-200'
        : formData.gender === 'boy'
          ? 'from-blue-200 via-blue-50 to-indigo-200'
          : formData.gender === 'neutral'
            ? 'from-purple-200 via-purple-50 to-violet-200'
            : 'from-pink-200 via-white to-blue-200'
    }`}>
      <div className={`max-w-7xl mx-auto backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 transition-all duration-1000 ease-in-out ${
        formData.gender === 'girl'
          ? 'bg-white/80 border-pink-200 shadow-pink-200/50'
          : formData.gender === 'boy'
            ? 'bg-white/80 border-blue-200 shadow-blue-200/50'
            : formData.gender === 'neutral'
              ? 'bg-white/80 border-purple-200 shadow-purple-200/50'
              : 'bg-white/90 border-pink-100 border-r-blue-100 shadow-pink-100/25 shadow-blue-100/25'
      }`}>
        <h1 className={`text-4xl font-bold text-center mb-8 transition-all duration-1000 ${
          formData.gender === 'girl'
            ? 'text-pink-600'
            : formData.gender === 'boy'
              ? 'text-blue-600'
              : formData.gender === 'neutral'
                ? 'text-purple-600'
                : 'bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text'
        }`}>
          Baby Name Finder
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gender Selection */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <label className="text-gray-700 text-lg font-medium block mb-3">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['boy', 'neutral', 'girl'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleToggleSelect('gender', gender)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.gender === gender 
                      ? gender === 'girl'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-lg shadow-pink-100'
                        : gender === 'boy'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100'
                          : 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg shadow-purple-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Heritage and Meaning Selection in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heritage Selection */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
                <label className="text-gray-700 text-lg font-medium">
                  Heritage & Origins
                </label>
                <button
                  type="button"
                  onClick={() => setIsHeritageModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all text-gray-600 hover:text-gray-900 text-lg font-medium shadow-sm hover:shadow-md"
                >
                  Select Heritage
                </button>
              </div>
              {formData.heritage.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.heritage.map(value => (
                    <span
                      key={value}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        formData.gender === 'girl'
                          ? 'bg-pink-100 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {heritageOptions.find(opt => opt.value === value)?.label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No heritage selected</p>
              )}
            </div>

            {/* Meaning Selection */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
                <label className="text-gray-700 text-lg font-medium">
                  Desired Meanings
                </label>
                <button
                  type="button"
                  onClick={() => setIsMeaningModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/50 hover:bg-white/80 transition-all text-gray-600 hover:text-gray-900 text-lg font-medium shadow-sm hover:shadow-md"
                >
                  Select Meanings
                </button>
              </div>
              {formData.meanings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.meanings.map(meaning => (
                    <span
                      key={meaning}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        formData.gender === 'girl'
                          ? 'bg-pink-100 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {meaning}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No meanings selected</p>
              )}
              <input
                type="text"
                value={formData.customMeaning}
                onChange={(e) => setFormData(prev => ({ ...prev, customMeaning: e.target.value }))}
                placeholder="Add custom meaning (optional)"
                className={`w-full p-4 mt-4 border-2 rounded-xl focus:ring-2 outline-none bg-white/50 backdrop-blur-sm ${
                  formData.gender === 'girl'
                    ? 'border-gray-200 focus:ring-pink-400 focus:border-pink-400'
                    : formData.gender === 'boy'
                      ? 'border-gray-200 focus:ring-blue-400 focus:border-blue-400'
                      : 'border-gray-200 focus:ring-purple-400 focus:border-purple-400'
                }`}
              />
            </div>
          </div>

          {/* Length, Popularity, and First Letter in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Length Preference */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <label className="text-gray-700 text-lg font-medium block mb-3">
                Name Length
              </label>
              <div className="flex gap-2">
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    type="button"
                    onClick={() => handleToggleSelect('lengthPreference', length)}
                    className={`flex-1 p-2 rounded-xl border-2 transition-all duration-200 capitalize ${
                      formData.lengthPreference === length 
                        ? formData.gender === 'girl'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : formData.gender === 'neutral'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            {/* Popularity Filter */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <label className="text-gray-700 text-lg font-medium block mb-3">
                Popularity
              </label>
              <div className="flex gap-2">
                {['unique', 'moderate', 'popular'].map((pop) => (
                  <button
                    key={pop}
                    type="button"
                    onClick={() => handleToggleSelect('popularity', pop)}
                    className={`flex-1 p-2 rounded-xl border-2 transition-all duration-200 capitalize ${
                      formData.popularity === pop 
                        ? formData.gender === 'girl'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : formData.gender === 'neutral'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>

            {/* First Letter */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm">
              <label className="text-gray-700 text-lg font-medium block mb-3">
                First Letter
              </label>
              <input
                type="text"
                value={formData.firstLetter}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  firstLetter: e.target.value.toUpperCase().slice(0, 1)
                }))}
                maxLength={1}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 outline-none bg-white/50 backdrop-blur-sm ${
                  formData.gender === 'girl'
                    ? 'border-gray-200 focus:ring-pink-400 focus:border-pink-400'
                    : formData.gender === 'boy'
                      ? 'border-gray-200 focus:ring-blue-400 focus:border-blue-400'
                      : formData.gender === 'neutral'
                        ? 'border-gray-200 focus:ring-purple-400 focus:border-purple-400'
                        : 'border-gray-200 focus:ring-blue-400 focus:border-blue-400'
                }`}
                placeholder="A-Z"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full p-4 rounded-xl font-semibold text-lg transform transition-all duration-500 
                     hover:shadow-lg hover:scale-[1.02] active:scale-95 text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              formData.gender === 'girl'
                ? 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 hover:shadow-pink-200'
                : formData.gender === 'boy'
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 hover:shadow-blue-200'
                  : formData.gender === 'neutral'
                    ? 'bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600 hover:shadow-purple-200'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isLoading ? 'Finding Perfect Names...' : 'Find Perfect Names'}
          </button>
        </form>

        {suggestedNames.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedNames.map((suggestion, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-inner transition-all duration-500 ${
                  formData.gender === 'girl'
                    ? 'bg-gradient-to-r from-pink-100 to-rose-100 shadow-pink-200'
                    : formData.gender === 'boy'
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 shadow-blue-200'
                      : formData.gender === 'neutral'
                        ? 'bg-gradient-to-r from-purple-100 to-violet-100 shadow-purple-200'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100'
                }`}
              >
                <p className={`text-3xl text-center font-bold tracking-wide mb-3 ${
                  formData.gender === 'girl'
                    ? 'text-pink-600'
                    : formData.gender === 'boy'
                      ? 'text-blue-600'
                      : formData.gender === 'neutral'
                        ? 'text-purple-600'
                        : 'text-indigo-600'
                }`}>
                  {suggestion.name}
                </p>
                
                {suggestion.originalScript && (
                  <p className="text-2xl text-center mb-4 font-medium text-gray-700">
                    {suggestion.originalScript}
                  </p>
                )}

                <div className="space-y-2 text-center">
                  <p className="font-medium text-gray-700">
                    Origin: {suggestion.origin}
                  </p>
                  <p className="text-gray-600">
                    {suggestion.meaning}
                  </p>
                  <p className="text-gray-600 mt-4 text-sm">
                    {suggestion.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="mt-8 p-8 rounded-xl shadow-inner bg-white/80 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-4">Discovering perfect names for you...</p>
          </div>
        )}

        {/* Heritage Modal */}
        {isHeritageModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Select Heritage & Origins</h3>
                <button
                  type="button"
                  onClick={() => setIsHeritageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {heritageOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleToggleSelect('heritage', value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.heritage.includes(value)
                        ? formData.gender === 'girl'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHeritageModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meanings Modal */}
        {isMeaningModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Select Desired Meanings</h3>
                <button
                  type="button"
                  onClick={() => setIsMeaningModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {meaningOptions.map((meaning) => (
                  <button
                    key={meaning}
                    type="button"
                    onClick={() => handleToggleSelect('meanings', meaning)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 capitalize ${
                      formData.meanings.includes(meaning)
                        ? formData.gender === 'girl'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : formData.gender === 'boy'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {meaning}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMeaningModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
