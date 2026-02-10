import { useState } from 'react';
import { Search } from 'lucide-react';

export default function ClinicSearch({ onSearch }) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchValue);
        }
    };

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch(searchValue);
        }
    };

<<<<<<< HEAD
export default function ClinicSearch({ onToggleView, viewMode, value, onChange, placeholder }) {
=======
>>>>>>> main
    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Partnered Clinics Nearby</h2>
                <p className="text-muted-foreground">Find professional help in your current area.</p>
            </div>

<<<<<<< HEAD
            <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-3 w-full bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-700 placeholder:text-slate-400"
                        placeholder={placeholder || 'Search clinics or address'}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                    />
                </div>

                {/* View Toggle */}
                <div className="flex bg-white p-1 rounded-xl shadow-xs border border-slate-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleView('map')}
                        className={`rounded-lg text-xs font-semibold px-4 h-9 transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <MapIcon className="w-3.5 h-3.5 mr-2" /> Map View
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleView('list')}
                        className={`rounded-lg text-xs font-semibold px-4 h-9 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900 border border-slate-100' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <List className="w-3.5 h-3.5 mr-2" /> List View
                    </Button>
=======
            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
>>>>>>> main
                </div>
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-12 py-3 w-full bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-700 placeholder:text-slate-400"
                    placeholder="Search clinics by name..."
                />
                <button
                    onClick={handleSearchClick}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-veri5-teal transition-colors"
                >
                    <Search className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
