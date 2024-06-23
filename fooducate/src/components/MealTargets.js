import { Stack, Typography } from '@mui/material'
import React from 'react'
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';

export default function MealTargets() {
  return (
    <React.Fragment>
        <React.Fragment>
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{height: '25%' }}>
                <Typography variant="h6" color="#494949" sx={{ fontWeight: 'medium'}}>
                    Meal Targets
                </Typography>
                <Button startIcon={<EditIcon />} sx={{width: 100, bgcolor: "#2E4998"  }} size="small" variant="contained">Edit</Button>
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{height: '75%' }}>
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', height: '50%', alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography color="#3F3F3F" fontWeight="600" variant="body1">
                        Carbs
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#6D4CB5" fontSize={25} lineHeight={1}>
                        100
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', height: '50%', alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography fontWeight="600" variant="body1" color="#3F3F3F">
                        Protein
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#35348A" fontSize={25} lineHeight={1}>
                        210
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
                <Card variant="outlined" sx={{ borderColor: "#E4E6F0", borderWidth: 2, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', height: '50%', alignItems: 'center', padding: 1, borderRadius: 2}}>
                    <Typography fontWeight="600" variant="body1" color="#3F3F3F">
                        Fats
                    </Typography>
                    <Stack direction="row" justifyContent="space-around" alignItems="flex-end">
                    <Typography color="#6971B9" fontSize={25} lineHeight={1}>
                        80
                    </Typography>
                    <Typography color="#6B747E" variant="body2" lineHeight={1}>
                        gm
                    </Typography>
                    </Stack>
                </Card>
            </Stack>
        </React.Fragment>
    </React.Fragment>
  )
}

