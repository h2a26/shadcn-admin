import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { labels, priorities, statuses } from '../data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<{
  id: string
  title: string
  status: string
  label: string
  priority: string
}>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    accessorFn: (row) => row,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task' />
    ),
    accessorFn: (row) => row.id,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    accessorFn: (row) => row.title,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className='flex w-[240px] items-center space-x-2'>
          <div className='min-w-0 flex-1'>
            <p className='text-sm leading-6 font-medium'>
              {row.getValue('title')}
            </p>
            <p className='text-muted-foreground mt-1 truncate text-xs leading-5'>
              {label?.label ?? 'No label'}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    accessorFn: (row) => row.status,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )
      return status ? (
        <Badge
          variant={
            status.variant as
              | 'secondary'
              | 'default'
              | 'outline'
              | 'destructive'
          }
        >
          {status.label}
        </Badge>
      ) : (
        <Badge variant='outline'>Unknown</Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      return (
        <div className='flex items-center'>
          {priority.icon && (
            <priority.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    accessorFn: (row) => row,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
