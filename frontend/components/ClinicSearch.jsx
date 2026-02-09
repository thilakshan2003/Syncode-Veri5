import { Search, Map as MapIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClinicSearch({ onToggleView, viewMode }) {
    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Partnered Clinics Nearby</h2>
                <p className="text-muted-foreground">Find professional help in your current area.</p>
            </div>

            <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="pl-10 pr-4 py-3 w-full bg-background border-2 border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-medium shadow-sm text-foreground placeholder:text-muted-foreground/30"
                        placeholder="Wellawatte, Colombo"
                        defaultValue="Wellawatte, Colombo"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex bg-background p-1 rounded-xl shadow-xs border border-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleView('map')}
                        className={`rounded-lg text-xs font-semibold px-4 h-9 transition-all ${viewMode === 'map' ? 'bg-card shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <MapIcon className="w-3.5 h-3.5 mr-2" /> Map View
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleView('list')}
                        className={`rounded-lg text-xs font-semibold px-4 h-9 transition-all ${viewMode === 'list' ? 'bg-card shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <List className="w-3.5 h-3.5 mr-2" /> List View
                    </Button>
                </div>
            </div>
        </div>
    );
}
