import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language === 'es' ? 'ES' : 'EN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-9 w-12 px-0 font-bold text-[10px] tracking-widest gap-1 border-slate-100 hover:bg-slate-50">
            <Globe className="h-3 w-3 text-slate-400" />
            {currentLanguage}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-32 rounded-xl border-slate-100 shadow-xl">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className="text-[10px] font-bold uppercase tracking-widest cursor-pointer"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className="text-[10px] font-bold uppercase tracking-widest cursor-pointer"
        >
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
