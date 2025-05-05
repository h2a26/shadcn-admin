import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { DraftsTable } from './drafts-table';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Plus, FileText } from 'lucide-react';
import { DraftsProvider } from '../context/drafts-context';
import { DraftViewDialog } from './draft-view-dialog.tsx';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DraftsView() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('proposal');

  const handleCreateNew = () => {
    switch (selectedType) {
      case 'proposal':
        // Navigate to the proposal page
        navigate({ to: '/' });
        break;
      case 'policy':
        // Navigate to the home page until policy route exists
        navigate({ to: '/' });
        break;
      case 'claim':
        // Navigate to the home page until claims route exists
        navigate({ to: '/' });
        break;
      default:
        navigate({ to: '/' });
    }
  };

  return (
    <DraftsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
              <FileText className="h-6 w-6" />
              Drafts
            </h2>
            <p className='text-muted-foreground'>
              Resume or manage your saved drafts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="claim">Claim</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Draft
            </Button>
          </div>
        </div>
        
        <div className='space-y-6'>
          <DraftsTable />
        </div>
        
        {/* Dialogs */}
        <DraftViewDialog />
      </Main>
    </DraftsProvider>
  );
}
