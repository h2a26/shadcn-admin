import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Plus, FileText } from 'lucide-react';
import { DraftsProvider } from '@/features/drafts/context/drafts-context';
import { DraftsTable } from '@/features/drafts/components/drafts-table';
import { DraftViewDialog } from '@/features/drafts/components/draft-view-dialog';
import { useState } from 'react';


export function DraftsView() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('proposal');

  const handleCreateNew = () => {
    switch (selectedType) {
      case 'proposal':
        navigate({ to: '/proposal' });
        break;
      case 'policy':
        navigate({ to: '/' });
        break;
      case 'claim':
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
        
        <DraftViewDialog />
      </Main>
    </DraftsProvider>
  );
}
